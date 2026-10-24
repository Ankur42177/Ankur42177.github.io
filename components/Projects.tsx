import { ArrowUpRight, Sparkles } from "lucide-react";
import { projects } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="Things I've built">
      <div className="grid gap-6">
        {projects.map((p) => (
          <Reveal key={p.title}>
            <article className="card relative overflow-hidden p-8 md:p-10">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200 to-sky-100 opacity-60 blur-3xl" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-3">
                  <Sparkles className="text-violet-500" size={22} />
                  <h3 className="text-2xl font-bold md:text-3xl">{p.title}</h3>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{p.award}</span>
                </div>
                <p className="mt-4 max-w-2xl text-lg text-neutral-600">{p.description}</p>
                <ul className="mt-6 space-y-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-neutral-700">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />{h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                {p.links.length > 0 && (
                  <div className="mt-6 flex gap-5">
                    {p.links.map((l) => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-medium hover:underline">
                        {l.label} <ArrowUpRight size={16} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Reveal>
        ))}
        <p className="text-center text-neutral-500">More projects coming soon ✨</p>
      </div>
    </Section>
  );
}
