"use client";
/**
 * Learning lab: what I learned building Pulse (microservices at scale) and Intruva (prompt security).
 * Pulse = a phase rail you can click (it auto-plays until you interact). Intruva = an animated engine pipeline.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleDashed, Loader } from "lucide-react";
import { intruvaLearned, intruvaPipeline, pulsePhases, projects } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

type Tab = "pulse" | "intruva";

/** Cycles 0..n-1 every `ms` until `stopped` is true; respects reduced motion. */
function useAutoplay(n: number, ms: number, stopped: boolean, start = 0) {
  const [i, setI] = useState(start);
  useEffect(() => {
    if (stopped || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => window.clearInterval(t);
  }, [n, ms, stopped]);
  return [i, setI] as const;
}

function PulseLab() {
  const [touched, setTouched] = useState(false);
  const [i, setI] = useAutoplay(pulsePhases.length, 3200, touched);
  const phase = pulsePhases[i];
  const done = pulsePhases.filter((p) => p.status === "done").length;

  return (
    <div>
      <div className="mb-5 flex items-center gap-4">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-soft">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-iris via-aqua to-coral"
            initial={{ width: 0 }} whileInView={{ width: `${(done / pulsePhases.length) * 100}%` }} viewport={{ once: true }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-muted">{done}/{pulsePhases.length} phases shipped</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12" role="tablist" aria-label="Pulse phases">
        {pulsePhases.map((p, k) => {
          const on = k === i;
          return (
            <button key={p.n} type="button" role="tab" aria-selected={on} onClick={() => { setTouched(true); setI(k); }}
              className={`relative overflow-hidden rounded-2xl border px-2 py-3 text-center transition ${on ? "border-accent bg-soft" : "border-line hover:border-muted"}`}>
              {on && !touched && (
                <motion.span key={`bar-${k}`} className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-aqua"
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 3.2, ease: "linear" }} />
              )}
              <span className="block text-lg font-bold tabular-nums">{String(p.n).padStart(2, "0")}</span>
              <span className="mt-1 flex justify-center">
                {p.status === "done" ? <Check size={14} className="text-emerald-400" /> : p.status === "wip" ? <Loader size={14} className="animate-spin text-amber-400 [animation-duration:3s]" /> : <CircleDashed size={14} className="text-muted" />}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={phase.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}
          className="mt-6 grid gap-6 md:grid-cols-[1fr_1.4fr] md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-muted">Phase {phase.n} · {phase.status === "done" ? "shipped" : phase.status === "wip" ? "in progress" : "up next"}</p>
            <h4 className="mt-1 text-2xl font-bold">{phase.title}</h4>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {phase.learned.map((l, k) => (
              <motion.div key={l} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.07 }}
                className="rounded-xl border border-line bg-soft px-3 py-2.5 text-sm font-medium">
                {l}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function IntruvaLab() {
  const [touched, setTouched] = useState(false);
  const [i, setI] = useAutoplay(intruvaPipeline.length, 1800, touched);
  const s = intruvaPipeline[i];

  return (
    <div>
      <div className="relative flex items-start justify-between gap-1">
        <span className="absolute left-4 right-4 top-4 h-0.5 bg-line" aria-hidden="true" />
        <motion.span aria-hidden="true" className="absolute left-4 top-4 h-0.5 bg-gradient-to-r from-iris to-aqua"
          animate={{ width: `calc(${(i / (intruvaPipeline.length - 1)) * 100}% - ${(i / (intruvaPipeline.length - 1)) * 2}rem)` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} />
        {intruvaPipeline.map((p, k) => {
          const on = k <= i;
          return (
            <button key={p.step} type="button" onClick={() => { setTouched(true); setI(k); }} aria-pressed={k === i}
              className="relative z-10 flex flex-1 flex-col items-center gap-2 text-center">
              <motion.span animate={{ scale: k === i ? 1.2 : 1 }}
                className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold transition-colors ${on ? "border-transparent bg-gradient-to-br from-iris to-aqua text-white" : "border-line bg-card text-muted"}`}>
                {k + 1}
              </motion.span>
              <span className={`hidden text-xs font-semibold sm:block ${k === i ? "text-fg" : "text-muted"}`}>{p.step}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={s.step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          className="mt-6 rounded-2xl border border-line bg-soft p-4 text-center">
          <span className="font-semibold">{s.step}.</span> <span className="text-muted">{s.detail}</span>
        </motion.p>
      </AnimatePresence>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {intruvaLearned.map((l, k) => (
          <Reveal key={l} delay={k * 0.04}>
            <div className="h-full rounded-xl border border-line px-3 py-2.5 text-sm font-medium transition hover:border-accent hover:bg-soft">{l}</div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Lab() {
  const [tab, setTab] = useState<Tab>("pulse");
  const stackAll = Array.from(new Set(projects.slice(0, 2).flatMap((p) => p.stack)));

  return (
    <Section id="lab" eyebrow="Learning lab" title="What I *learned* building"
      intro="Two side projects I use to go deep: Pulse, a microservices platform built phase by phase, and Intruva, a prompt-security engine. Here is what each one taught me.">
      <Reveal>
        <div className="mb-6 inline-flex rounded-full border border-line bg-soft p-1" role="tablist" aria-label="Project">
          {([["pulse", "♠ Pulse · microservices at scale"], ["intruva", "♦ Intruva · prompt security"]] as [Tab, string][]).map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === id ? "text-white" : "text-muted hover:text-fg"}`}>
              {tab === id && <motion.span layoutId="lab-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-iris to-aqua" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="card p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              {tab === "pulse" ? <PulseLab /> : <IntruvaLab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Reveal>

      <div className="marquee mt-10 overflow-hidden" aria-label="Tech stack used in these projects">
        <div className="flex w-max gap-3">
          {[...stackAll, ...stackAll].map((t, k) => (
            <span key={k} className="glass whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium" aria-hidden={k >= stackAll.length}>{t}</span>
          ))}
        </div>
      </div>
    </Section>
  );
}
