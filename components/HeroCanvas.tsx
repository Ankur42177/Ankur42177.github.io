"use client";
/**
 * Hero backdrop: a living "service mesh" — nodes drift, link up when close, and data packets travel along the links.
 * The cursor pulls nearby nodes in and lights up its neighbourhood; a click sends a shockwave.
 * One canvas, rAF loop paused when off-screen or the tab is hidden, DPR-aware, still frame under reduced motion.
 */
import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hue: number };
type Packet = { a: number; b: number; t: number; speed: number };

const LINK = 140;
const COLORS = ["139,123,255", "44,198,207", "255,171,125"];

export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0, H = 0, dpr = 1;
    let nodes: Node[] = [];
    const packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    const waves: { x: number; y: number; r: number }[] = [];

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      const count = Math.round(Math.min(110, Math.max(40, (W * H) / 14000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 22, vy: (Math.random() - 0.5) * 22,
        r: 1.2 + Math.random() * 2.2, hue: Math.floor(Math.random() * COLORS.length),
      }));
      packets.length = 0;
    };
    resize();

    const light = () => !document.documentElement.classList.contains("dark");

    const step = (dt: number) => {
      for (const n of nodes) {
        if (mouse.active) {
          const dx = mouse.x - n.x, dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200 && d2 > 400) { n.vx += (dx / Math.sqrt(d2)) * 40 * dt; n.vy += (dy / Math.sqrt(d2)) * 40 * dt; }
        }
        for (const w of waves) {
          const dx = n.x - w.x, dy = n.y - w.y, d = Math.hypot(dx, dy) || 1;
          if (Math.abs(d - w.r) < 30) { n.vx += (dx / d) * 180 * dt * 10; n.vy += (dy / d) * 180 * dt * 10; }
        }
        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 60) { n.vx *= 0.96; n.vy *= 0.96; }
        n.x += n.vx * dt; n.y += n.vy * dt;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        n.x = Math.max(0, Math.min(W, n.x)); n.y = Math.max(0, Math.min(H, n.y));
      }
      for (let i = waves.length - 1; i >= 0; i--) { waves[i].r += 520 * dt; if (waves[i].r > 600) waves.splice(i, 1); }
      // spawn packets along existing links
      if (packets.length < 26 && Math.random() < 0.25) {
        const a = Math.floor(Math.random() * nodes.length);
        let best = -1, bd = LINK * LINK;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const dx = nodes[j].x - nodes[a].x, dy = nodes[j].y - nodes[a].y, d2 = dx * dx + dy * dy;
          if (d2 < bd && Math.random() < 0.5) { bd = d2; best = j; }
        }
        if (best >= 0) packets.push({ a, b: best, t: 0, speed: 0.6 + Math.random() * 0.9 });
      }
      for (let i = packets.length - 1; i >= 0; i--) { packets[i].t += packets[i].speed * dt; if (packets[i].t >= 1) packets.splice(i, 1); }
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const lineBase = light() ? "20,33,61" : "180,190,255";
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          const near = mouse.active && Math.hypot(mouse.x - a.x, mouse.y - a.y) < 180;
          const alpha = (1 - Math.sqrt(d2) / LINK) * (near ? 0.55 : 0.16);
          ctx.strokeStyle = near ? `rgba(44,198,207,${alpha})` : `rgba(${lineBase},${alpha})`;
          ctx.lineWidth = near ? 1.2 : 0.8;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${COLORS[n.hue]},0.85)`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      for (const p of packets) {
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
        g.addColorStop(0, "rgba(255,255,255,0.95)"); g.addColorStop(0.4, "rgba(44,198,207,0.6)"); g.addColorStop(1, "rgba(44,198,207,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.fill();
      }
      for (const w of waves) {
        ctx.strokeStyle = `rgba(139,123,255,${Math.max(0, 0.5 - w.r / 1200)})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.stroke();
      }
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 160);
        g.addColorStop(0, "rgba(139,123,255,0.12)"); g.addColorStop(1, "rgba(139,123,255,0)");
        ctx.fillStyle = g; ctx.fillRect(mouse.x - 160, mouse.y - 160, 320, 320);
      }
    };

    if (reduce) { draw(); return; }

    let raf = 0, last = performance.now(), visible = true;
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      step(dt); draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(canvas);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= H;
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      if (y < 0 || y > H) return;
      if ((e.target as Element)?.closest("a,button")) return;
      waves.push({ x: e.clientX - r.left, y, r: 0 });
    };
    const onVis = () => (document.hidden ? stop() : start());
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    start();
    return () => {
      stop(); io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas ref={ref} aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_40%,transparent_100%)]" />
  );
}
