import { ArrowUpRight, BookOpen } from "lucide-react";
import { formatDate, type PostMeta } from "../lib/blog";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Hobbies({ posts }: { posts: PostMeta[] }) {
  return (
    <Section id="hobbies" eyebrow="Off the pitch" title="Football & Manchester City">
      <div className="grid gap-6 md:grid-cols-5">
        <Reveal className="md:col-span-2">
          <div className="card relative h-full overflow-hidden border-city/40 bg-gradient-to-br from-city/20 via-card to-card p-8">
            <div className="absolute -right-6 -top-6 text-[8rem] leading-none opacity-15 select-none">⚽</div>
            <p className="text-4xl">🩵</p>
            <h3 className="mt-4 text-2xl font-bold">Avid football fan</h3>
            <p className="mt-3 text-muted">
              When I&apos;m not building AI or security tools, I&apos;m watching Manchester City — and breaking down how Pep
              Guardiola&apos;s teams control games. I write about tactics, systems and the ideas behind City&apos;s success.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Man City", "Pep Guardiola", "Tactics", "Positional play"].map((t) => (
                <span key={t} className="rounded-full bg-city/15 px-3 py-1 text-sm font-medium text-sky-800 dark:text-sky-200">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-3">
          <Reveal delay={0.1}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="inline-flex items-center gap-2 font-semibold"><BookOpen size={18} /> Football blog</h3>
              <a href="/blog/" className="text-sm text-muted hover:text-fg">All posts →</a>
            </div>
          </Reveal>
          <div className="space-y-4">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={0.15 + i * 0.08}>
                <a href={`/blog/${p.slug}/`} className="card group block">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted">{formatDate(p.date)} · {p.readingMinutes} min read</p>
                      <h4 className="mt-1 text-lg font-semibold">{p.title}</h4>
                      <p className="mt-2 text-muted">{p.summary}</p>
                    </div>
                    <ArrowUpRight className="shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-city" />
                  </div>
                </a>
              </Reveal>
            ))}
            {posts.length === 0 && <p className="text-muted">First post coming soon.</p>}
          </div>
        </div>
      </div>
    </Section>
  );
}
