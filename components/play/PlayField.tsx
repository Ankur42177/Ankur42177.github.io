"use client";
/**
 * Play mode ⚽ — footballs (or glowing tech-stack orbs) drip from the top of the screen, bounce, collide and pile
 * up. Move the mouse (or a finger) through them to kick; click empty space for a burst; kick them into the goal
 * in the bottom-right corner to score.
 *
 * Adapted from Pulse's PlayField. Manners:
 *  - one <canvas> fixed over the page with pointer-events: none, so the page stays fully clickable
 *  - rendered through a portal into <body> (the navbar's backdrop-filter would otherwise trap position: fixed)
 *  - requestAnimationFrame loop, paused while the tab is hidden; delta time clamped
 *  - devicePixelRatio-aware, ball count capped, every ball drawn from a pre-rendered sprite
 *  - turns itself off under "reduce motion"; Esc stops it
 *  - only ever loaded in the browser (dynamic import after a click), so `document` is always available
 */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { playOrbs } from "../../lib/data";

type Kind = "football" | "orbs";
type Ball = { x: number; y: number; vx: number; vy: number; r: number; a: number; sprite: number };

const MAX_BALLS = 70;
const DRIP_TOTAL = 28;
const DRIP_EVERY = 240;
const GRAVITY = 2000;
const BOUNCE = 0.5;
const KICK_REACH = 14;
const ORB_COLORS: [string, string][] = [["#8b7bff", "#4b3bd1"], ["#2cc6cf", "#0e6f76"], ["#ffab7d", "#c2562f"], ["#6cabdd", "#1d4f7a"], ["#5fe0a4", "#1a7f55"]];

/** Classic black-and-white football on an offscreen canvas. */
function footballSprite(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const R = size / 2;
  const g = c.getContext("2d")!;
  const poly = (cx: number, cy: number, rad: number, rot: number) =>
    Array.from({ length: 5 }, (_, k) => {
      const t = rot + (k * 2 * Math.PI) / 5;
      return [cx + rad * Math.cos(t), cy + rad * Math.sin(t)] as [number, number];
    });
  const fillPoly = (pts: [number, number][]) => {
    g.beginPath();
    pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.closePath();
    g.fill();
  };
  g.save();
  g.beginPath();
  g.arc(R, R, R - 1, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = "#fbfbfd";
  g.fillRect(0, 0, size, size);
  const pr = R * 0.34;
  const centre = poly(R, R, pr, -Math.PI / 2);
  g.fillStyle = "#111827";
  fillPoly(centre);
  g.strokeStyle = "#2b3242";
  g.lineWidth = Math.max(1, size / 90);
  const outer: [number, number][][] = [];
  for (let k = 0; k < 5; k++) {
    const t = -Math.PI / 2 + (k * 2 * Math.PI) / 5;
    const pts = poly(R + Math.cos(t) * R * 0.98, R + Math.sin(t) * R * 0.98, pr, t + Math.PI);
    outer.push(pts);
    fillPoly(pts);
    g.beginPath();
    g.moveTo(centre[k][0], centre[k][1]);
    g.lineTo(pts[0][0], pts[0][1]);
    g.stroke();
  }
  for (let k = 0; k < 5; k++) {
    const a = outer[k], b = outer[(k + 1) % 5];
    g.beginPath();
    g.moveTo(a[4][0], a[4][1]);
    g.lineTo(b[1][0], b[1][1]);
    g.stroke();
  }
  g.restore();
  return c;
}

/** A glossy glass orb with a tech label. */
function orbSprite(size: number, label: string, [light, dark]: [string, string]) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const R = size / 2;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(R * 0.7, R * 0.6, R * 0.1, R, R, R);
  grad.addColorStop(0, light);
  grad.addColorStop(1, dark);
  g.fillStyle = grad;
  g.beginPath();
  g.arc(R, R, R - 1, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.font = `700 ${Math.round(size / (label.length > 5 ? 5.4 : 4.2))}px Inter, system-ui, sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(label, R, R + 1);
  return c;
}

/** Shading that does NOT rotate, so the light always comes from the top-left. */
function shadeSprite(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const R = size / 2;
  const s = c.getContext("2d")!;
  const grad = s.createRadialGradient(R * 0.65, R * 0.55, R * 0.1, R, R, R);
  grad.addColorStop(0, "rgba(255,255,255,0.4)");
  grad.addColorStop(0.55, "rgba(255,255,255,0)");
  grad.addColorStop(1, "rgba(10,18,40,0.38)");
  s.fillStyle = grad;
  s.beginPath();
  s.arc(R, R, R - 1, 0, Math.PI * 2);
  s.fill();
  return c;
}

export default function PlayField({ onStop }: { onStop: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ clear: () => void; rain: () => void; setKind: (k: Kind) => void } | null>(null);
  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [kind, setKind] = useState<Kind>("football");
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) { onStop(); return; }

    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };
    resize();

    const football = footballSprite(128);
    const orbs = playOrbs.map((l, i) => orbSprite(128, l, ORB_COLORS[i % ORB_COLORS.length]));
    const shade = shadeSprite(128);
    let mode: Kind = "football";

    const balls: Ball[] = [];
    let dripped = 0, dripping = true, lastDrip = 0, goals = 0;
    let flash = 0;                                         // "GOAL!" banner timer (s)
    const radius = () => Math.max(14, Math.min(28, W / 60)) * (0.85 + Math.random() * 0.3) * (mode === "orbs" ? 1.25 : 1);
    const pick = () => (mode === "orbs" ? Math.floor(Math.random() * orbs.length) : -1);

    // the goal: a net standing on the floor in the bottom-right corner
    const goal = () => {
      const gw = Math.max(70, Math.min(120, W * 0.09));
      const gh = Math.max(110, Math.min(170, H * 0.22));
      return { x: W - gw, top: H - gh, w: gw, h: gh };
    };

    const add = (b: Ball) => {
      balls.push(b);
      if (balls.length > MAX_BALLS) balls.shift();
    };
    const drip = () => {
      const r = radius();
      add({ x: r + Math.random() * (W * 0.8 - 2 * r), y: -r - 10, vx: (Math.random() - 0.5) * 140, vy: 60 + Math.random() * 120, r, a: Math.random() * 6.28, sprite: pick() });
      dripped++;
    };
    const burst = (x: number, y: number) => {
      for (let i = 0; i < 7; i++) {
        const t = (i / 7) * Math.PI * 2 + Math.random() * 0.4;
        const sp = 420 + Math.random() * 380;
        add({ x, y, vx: Math.cos(t) * sp, vy: Math.sin(t) * sp - 300, r: radius(), a: Math.random() * 6.28, sprite: pick() });
      }
    };
    api.current = {
      clear: () => { balls.length = 0; dripping = false; },
      rain: () => { dripped = 0; dripping = true; },
      setKind: (k) => { mode = k; for (const b of balls) { b.sprite = pick(); if (k === "orbs") b.r *= 1.25; else b.r /= 1.25; } },
    };

    // the pointer is the boot: position + smoothed velocity (px/s)
    const p = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0, active: false };
    const onMove = (e: PointerEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - p.t) / 1000;
      if (p.active) {
        p.vx = p.vx * 0.5 + ((e.clientX - p.x) / dt) * 0.5;
        p.vy = p.vy * 0.5 + ((e.clientY - p.y) / dt) * 0.5;
      }
      p.x = e.clientX; p.y = e.clientY; p.t = now; p.active = true;
    };
    const onLeave = () => { p.active = false; p.x = p.y = -9999; p.vx = p.vy = 0; };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t?.closest("a, button, input, textarea, select, label, summary, [role='button'], [data-deck-card], [data-play-hud]")) return;
      burst(e.clientX, e.clientY);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onStop(); };

    const step = (dt: number) => {
      const G = goal();
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y + b.r > H) {
          b.y = H - b.r;
          b.vy = Math.abs(b.vy) < 70 ? 0 : -b.vy * BOUNCE;
          b.vx *= 0.985;
        }
        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.6; }
        // crossbar: a ball dropping onto the top of the goal bounces off it
        if (b.x > G.x && b.y < G.top && b.y + b.r > G.top && b.vy > 0) { b.y = G.top - b.r; b.vy = -b.vy * BOUNCE; }
        // GOAL: the ball's centre is inside the net
        if (b.x > G.x + b.r * 0.5 && b.y > G.top + b.r * 0.5) {
          balls.splice(i, 1);
          goals++;
          flash = 1.2;
          setScore(goals);
          continue;
        }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.6; }
        b.vx *= 0.999;
        b.a += (b.vx / b.r) * dt;
      }
      for (let i = 0; i < balls.length; i++) {
        const a = balls[i];
        for (let j = i + 1; j < balls.length; j++) {
          const b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const min = a.r + b.r;
          const d2 = dx * dx + dy * dy;
          if (d2 >= min * min || d2 === 0) continue;
          const d = Math.sqrt(d2);
          const nx = dx / d, ny = dy / d;
          const ma = a.r * a.r, mb = b.r * b.r;
          const overlap = min - d;
          a.x -= nx * overlap * (mb / (ma + mb));
          a.y -= ny * overlap * (mb / (ma + mb));
          b.x += nx * overlap * (ma / (ma + mb));
          b.y += ny * overlap * (ma / (ma + mb));
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          if (rel < 0) {
            const imp = (-(1 + 0.45) * rel) / (1 / ma + 1 / mb);
            a.vx -= (imp / ma) * nx; a.vy -= (imp / ma) * ny;
            b.vx += (imp / mb) * nx; b.vy += (imp / mb) * ny;
          }
        }
      }
      if (p.active) {
        for (const b of balls) {
          const dx = b.x - p.x, dy = b.y - p.y;
          const reach = b.r + KICK_REACH;
          const d2 = dx * dx + dy * dy;
          if (d2 >= reach * reach) continue;
          const d = Math.sqrt(d2) || 1;
          const nx = dx / d, ny = dy / d;
          b.x = p.x + nx * reach;
          b.y = p.y + ny * reach;
          const push = Math.max(220, p.vx * nx + p.vy * ny);
          b.vx += nx * push * 0.9 + p.vx * 0.35;
          b.vy += ny * push * 0.9 + p.vy * 0.35 - 120;
          const sp = Math.hypot(b.vx, b.vy);
          if (sp > 2600) { b.vx *= 2600 / sp; b.vy *= 2600 / sp; }
        }
        p.vx *= 0.8; p.vy *= 0.8;
      }
    };

    const drawGoal = () => {
      const G = goal();
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      for (let x = G.x + 12; x < W; x += 12) { ctx.beginPath(); ctx.moveTo(x, G.top); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = G.top + 12; y < H; y += 12) { ctx.beginPath(); ctx.moveTo(G.x, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = "#f4f4f5";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(G.x, H);
      ctx.lineTo(G.x, G.top);
      ctx.lineTo(W, G.top);
      ctx.stroke();
      ctx.restore();
    };

    const draw = (dt: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      drawGoal();
      for (const b of balls) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.sprite >= 0 ? b.a * 0.35 : b.a);
        const img = b.sprite >= 0 ? orbs[b.sprite] : football;
        ctx.drawImage(img, -b.r, -b.r, b.r * 2, b.r * 2);
        ctx.restore();
        ctx.drawImage(shade, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
      if (flash > 0) {
        flash -= dt;
        const t = Math.max(0, flash) / 1.2;
        ctx.save();
        ctx.globalAlpha = Math.min(1, t * 2);
        ctx.fillStyle = "#6cabdd";
        ctx.font = `800 ${Math.round(56 + (1 - t) * 30)}px Inter, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText("GOAL!", W / 2, H * 0.42);
        ctx.restore();
      }
    };

    let raf = 0, last = performance.now(), shown = -1;
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      if (dripping && dripped < DRIP_TOTAL && now - lastDrip > DRIP_EVERY) { drip(); lastDrip = now; }
      step(dt / 2);
      step(dt / 2);
      draw(dt);
      if (balls.length !== shown) { shown = balls.length; setCount(shown); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };
    const onVisibility = () => (document.hidden ? pause() : start());
    const onReduce = () => { if (reduce.matches) onStop(); };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("click", onClick);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", onReduce);
    start();

    return () => {
      pause();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("click", onClick);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", onReduce);
      api.current = null;
    };
  }, [onStop]);

  const switchKind = (k: Kind) => { setKind(k); api.current?.setKind(k); };
  const chip = "rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition hover:border-accent";

  return createPortal(
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />
      <div role="group" aria-label="Play mode controls" data-play-hud=""
        className="glass fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full py-1.5 pl-4 pr-1.5 text-fg">
        <span className="mr-1 text-[.7rem] font-bold uppercase tracking-[.14em]">
          {kind === "football" ? "⚽" : "🧠"} {count} · 🥅 {score}
          <span className="hidden font-medium normal-case tracking-normal text-muted md:inline"> · move to kick, click to burst, aim for the goal</span>
        </span>
        <div className="flex rounded-full bg-soft p-0.5" role="radiogroup" aria-label="Ball type">
          {(["football", "orbs"] as Kind[]).map((k) => (
            <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => switchKind(k)}
              className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${kind === k ? "bg-fg text-bg" : "text-muted"}`}>
              {k === "football" ? "Football" : "Tech"}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => api.current?.rain()} className={chip}>Rain</button>
        <button type="button" onClick={() => api.current?.clear()} className={chip}>Clear</button>
        <button type="button" onClick={onStop} className="rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white">Stop</button>
      </div>
    </>,
    document.body,
  );
}
