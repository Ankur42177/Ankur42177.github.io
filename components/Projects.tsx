"use client";
/**
 * Project centre: a playing-card deck (from Pulse's hero deck) on the left, the active project's details on the right.
 * Shuffle with ‹ › buttons, ← → keys (deck focused), swipe/drag, clicking a card behind the top one, or the index chips.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, GitBranch } from "lucide-react";
import { projects, type Project } from "../lib/data";
import Reveal from "./Reveal";
import Rich from "./Rich";
import Section from "./Section";

const VISIBLE = 4;
const SWIPE = 60;
const fanSlot = (d: number) => (d === 0 ? 0 : d % 2 === 1 ? (d + 1) / 2 : -d / 2);

function CardFace({ p }: { p: Project }) {
  const red = p.suit === "♥" || p.suit === "♦";
  return (
    <div className="pcard" style={{ background: `radial-gradient(120% 90% at 20% 0%, ${p.hue[0]}, ${p.hue[1]} 70%, #05060b)` }}>
      {/* generative art: rings + grid */}
      <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 140" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <pattern id={`g-${p.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="white" strokeOpacity=".15" strokeWidth=".3" />
          </pattern>
        </defs>
        <rect width="100" height="140" fill={`url(#g-${p.id})`} />
        {[18, 30, 42].map((r) => <circle key={r} cx="70" cy="52" r={r} fill="none" stroke="white" strokeOpacity=".22" strokeWidth=".5" />)}
      </svg>
      <div className="pcard-shine" />
      <div className="absolute left-4 top-4 z-[4] text-center leading-none">
        <div className="text-2xl font-bold">{p.rank}</div>
        <div className={`text-xl ${red ? "text-rose-300" : ""}`}>{p.suit}</div>
      </div>
      <div className="absolute bottom-4 right-4 z-[4] rotate-180 text-center leading-none">
        <div className="text-2xl font-bold">{p.rank}</div>
        <div className={`text-xl ${red ? "text-rose-300" : ""}`}>{p.suit}</div>
      </div>
      <div className={`absolute inset-0 z-[1] grid place-items-center text-[7rem] opacity-25 ${red ? "text-rose-200" : ""}`}>{p.suit}</div>
      <div className="absolute inset-x-5 bottom-14 z-[4]">
        <p className="text-[.65rem] font-bold uppercase tracking-[.2em] text-white/70">{p.kind}</p>
        <h3 className="mt-1 text-3xl font-bold tracking-tight">{p.title}</h3>
        <p className="mt-1 text-sm text-white/75">{p.subtitle}</p>
      </div>
    </div>
  );
}

function Deck({ active, show }: { active: number; show: (i: number, fly?: -1 | 1) => void }) {
  const n = projects.length;
  const deck = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; dx: number; moved: boolean; id: number } | null>(null);
  const suppress = useRef(false);

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, dx: 0, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    d.dx = e.clientX - d.x;
    if (!d.moved && Math.abs(d.dx) > 8 && Math.abs(d.dx) > Math.abs(e.clientY - d.y)) {
      d.moved = true;
      deck.current?.setPointerCapture(e.pointerId);
      deck.current?.setAttribute("data-dragging", "");
    }
    if (d.moved) deck.current?.style.setProperty("--drag", `${d.dx}px`);
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== e.pointerId) return;
    deck.current?.removeAttribute("data-dragging");
    deck.current?.style.removeProperty("--drag");
    if (!d.moved) return;
    suppress.current = true;
    if (d.dx <= -SWIPE) show(active + 1, -1);
    else if (d.dx >= SWIPE) show(active - 1, 1);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppress.current) { suppress.current = false; e.preventDefault(); e.stopPropagation(); return; }
    const w = (e.target as Element).closest<HTMLElement>("[data-deck-card]");
    if (w && w.dataset.pos !== "0") show(Number(w.dataset.index), -1);
    else if (w) show(active + 1, -1);
  };

  return (
    <div ref={deck} className="deck" tabIndex={0} role="region" aria-roledescription="card deck"
      aria-label="Projects — use the left and right arrow keys to shuffle"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); show(active + 1, -1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); show(active - 1, 1); }
      }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
      onClickCapture={onClickCapture} onDragStart={(e) => e.preventDefault()}>
      {projects.map((p, i) => {
        const d = (i - active + n) % n;
        return (
          <div key={p.id} data-deck-card="" data-index={i} data-pos={d} aria-hidden={d !== 0} className="deck-card"
            style={{ "--d": Math.min(d, VISIBLE), "--f": fanSlot(d) } as React.CSSProperties}>
            <CardFace p={p} />
          </div>
        );
      })}
    </div>
  );
}

export default function Projects() {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const show = (next: number, fly: -1 | 1 = -1) => {
    const target = ((next % n) + n) % n;
    if (target === active) return;
    setDir(fly < 0 ? 1 : -1);
    setActive(target);
  };

  const p = projects[active];

  return (
    <Section id="projects" eyebrow="Project centre" title="Things I've *built*"
      intro="Shuffle the deck: drag, use the arrows, or pick a card. Each one is a system I designed end to end.">
      <div className="grid items-center gap-14 lg:grid-cols-[340px_1fr]">
        <Reveal>
          <div className="flex flex-col items-center">
            <Deck active={active} show={show} />
            <div className="relative z-50 mt-10 flex items-center gap-4">
              <button type="button" className="icon-btn" onClick={() => show(active - 1, 1)} aria-label="Previous project"><ChevronLeft size={18} /></button>
              <div className="flex gap-1.5">
                {projects.map((q, i) => (
                  <button key={q.id} type="button" onClick={() => show(i, i > active ? -1 : 1)} aria-label={`Show ${q.title}`}
                    className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-gradient-to-r from-iris to-aqua" : "w-2 bg-line hover:bg-muted"}`} />
                ))}
              </div>
              <button type="button" className="icon-btn" onClick={() => show(active + 1, -1)} aria-label="Next project"><ChevronRight size={18} /></button>
            </div>
            <p className="mt-3 text-[.66rem] font-bold uppercase tracking-[.2em] text-muted" aria-hidden="true">
              <span className="hidden sm:inline">Hover to fan · ← → to shuffle</span><span className="sm:hidden">Swipe to shuffle</span>
            </p>
          </div>
        </Reveal>

        <div className="relative min-h-[520px]" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.article key={p.id} custom={dir}
              initial={{ opacity: 0, x: 40 * dir, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -40 * dir, filter: "blur(8px)" }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="card tilt p-7 md:p-9" data-fx="3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip">{p.kind}</span>
                {p.status && <span className="chip !text-accent-2">● {p.status}</span>}
                {p.award && <span className="rounded-full bg-amber-400/15 px-3 py-1 text-sm font-semibold text-amber-600 dark:text-amber-300">{p.award}</span>}
              </div>
              <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {p.title} <span className="font-display text-aurora text-[.8em]">{p.subtitle.split("·")[0]}</span>
              </h3>
              <p className="mt-3 text-lg text-muted">{p.pitch}</p>

              {p.flow && (
                <div className="mt-6 flex flex-wrap items-center gap-y-3" aria-label="How it flows">
                  {p.flow.map((f, i) => (
                    <div key={f} className="flex items-center">
                      <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.08 }}
                        className="rounded-xl border border-line bg-soft px-3 py-1.5 text-xs font-semibold">{f}</motion.span>
                      {i < p.flow!.length - 1 && <span className="flow-line mx-1.5 w-6 md:w-10" style={{ "--delay": `${i * 0.25}s` } as React.CSSProperties} />}
                    </div>
                  ))}
                </div>
              )}

              <ul className="mt-6 space-y-2.5">
                {p.highlights.map((h, i) => (
                  <motion.li key={h} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex gap-3 text-fg/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-iris to-aqua" /><span><Rich text={h} /></span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.stack.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              {p.links.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3">
                  {p.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5">
                      <GitBranch size={16} /> {l.label} <ArrowUpRight size={15} />
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
