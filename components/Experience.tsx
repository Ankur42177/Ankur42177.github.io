"use client";
/**
 * Experience: pick a role on the left (tabs), filter its achievements by track (Backend / Systems / AI),
 * and the list re-flows with layout animation. Education and awards sit underneath.
 */
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { awards, education, experience, tracks, type Track } from "../lib/data";
import Reveal from "./Reveal";
import Rich from "./Rich";
import Section from "./Section";

const trackColor: Record<Track, string> = {
  backend: "bg-aqua",
  systems: "bg-coral",
  ai: "bg-iris",
};

export default function Experience() {
  const [roleId, setRoleId] = useState(experience[0].id);
  const [track, setTrack] = useState<Track | "all">("all");
  const role = experience.find((r) => r.id === roleId)!;
  const shown = role.points.filter((p) => track === "all" || p.track === track);
  const countFor = (t: Track | "all") => role.points.filter((p) => t === "all" || p.track === t).length;

  return (
    <Section id="experience" eyebrow="Experience" title="Where I've *worked*"
      intro="Three years shipping enterprise endpoint security at Trellix — from Spring Boot services to kernel drivers to AI agents. Filter by track to see each side.">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* role timeline */}
        <Reveal>
          <div className="relative space-y-3 lg:sticky lg:top-28" role="tablist" aria-label="Roles">
            <span className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-iris via-aqua to-transparent" aria-hidden="true" />
            {experience.map((r) => {
              const on = r.id === roleId;
              return (
                <button key={r.id} type="button" role="tab" aria-selected={on}
                  onClick={() => { setRoleId(r.id); setTrack("all"); }}
                  className={`relative flex w-full items-start gap-4 rounded-2xl p-3 text-left transition ${on ? "glass" : "hover:bg-soft"}`}>
                  <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${on ? "border-transparent bg-gradient-to-br from-iris to-aqua text-white" : "border-line bg-card text-muted"}`}>
                    <Briefcase size={14} />
                  </span>
                  <span>
                    <span className="block font-semibold leading-snug">{r.role}</span>
                    <span className="block text-sm text-muted">{r.company} · {r.period}</span>
                  </span>
                </button>
              );
            })}
            <div className="flex items-start gap-4 rounded-2xl p-3">
              <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line bg-card text-muted"><GraduationCap size={14} /></span>
              <span>
                <span className="block font-semibold leading-snug">{education.degree}</span>
                <span className="block text-sm text-muted">{education.school}</span>
                <span className="block text-sm text-muted">{education.period} · {education.grade}</span>
              </span>
            </div>
          </div>
        </Reveal>

        {/* role detail */}
        <Reveal delay={0.1}>
          <div className="card p-7 md:p-8" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div key={role.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.3 }}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-bold">
                    {role.role} <span className="text-muted">@</span> <span className="text-aurora">{role.company}</span>
                  </h3>
                  <span className="chip">{role.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {[role.note, role.companyNote, role.location].filter(Boolean).join(" · ")}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* track filter */}
            <LayoutGroup id="tracks">
              <div className="mt-6 flex flex-wrap gap-1.5 rounded-full border border-line bg-soft p-1" role="radiogroup" aria-label="Filter by track">
                {tracks.map((t) => {
                  const n = countFor(t.id);
                  if (n === 0) return null;
                  const on = track === t.id;
                  return (
                    <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => setTrack(t.id)}
                      className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${on ? "text-bg" : "text-muted hover:text-fg"}`}>
                      {on && <motion.span layoutId="track-pill" className="absolute inset-0 rounded-full bg-fg" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                      <span className="relative z-10">{t.label} <span className="opacity-60">{n}</span></span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <motion.ul layout className="mt-6 space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((pt) => (
                  <motion.li key={pt.text} layout
                    initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className="group flex gap-3 rounded-2xl border border-transparent p-3 text-fg/80 transition hover:border-line hover:bg-soft">
                    <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${trackColor[pt.track]} transition group-hover:scale-150`} />
                    <span><Rich text={pt.text} className="font-semibold text-fg" /></span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-line pt-5 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-aqua" />Backend</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-coral" />Systems &amp; security</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-iris" />AI &amp; LLMs</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {awards.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.08}>
            <div className="card tilt flex items-center gap-4" data-fx="6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-400/15 text-amber-500"><Award size={22} /></span>
              <span>
                <span className="block font-semibold">{a.title}</span>
                <span className="block text-sm text-muted">{a.detail}</span>
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
