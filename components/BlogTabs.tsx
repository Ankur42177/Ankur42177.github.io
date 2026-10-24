"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Cpu, Trophy } from "lucide-react";
import type { Category, PostMeta } from "../lib/blog";

const tabs: { id: Category; label: string; icon: React.ReactNode; empty: string }[] = [
  { id: "sports", label: "Sports", icon: <Trophy size={15} />, empty: "Sports posts are on the way." },
  { id: "tech", label: "Tech", icon: <Cpu size={15} />, empty: "Tech write-ups on AI and security are on the way — stay tuned." },
];

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogTabs({ posts, limit }: { posts: PostMeta[]; limit?: number }) {
  const [tab, setTab] = useState<Category>("sports");
  const shown = posts.filter((p) => p.category === tab).slice(0, limit);
  const current = tabs.find((t) => t.id === tab)!;

  return (
    <div>
      <div className="mb-6 inline-flex rounded-full border border-line bg-card p-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === t.id ? "text-white" : "text-muted hover:text-fg"}`}>
            {tab === t.id && (
              <motion.span layoutId="blog-tab" className="absolute inset-0 rounded-full bg-city"
                transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">{t.icon}{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="grid gap-5 sm:grid-cols-2">
          {shown.map((p) => (
            <a key={p.slug} href={`/blog/${p.slug}/`} className="card group block overflow-hidden p-0">
              {p.cover && (
                <div className="relative h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.coverAlt ?? p.title} loading="lazy"
                    style={{ objectPosition: p.coverPosition ?? "center" }}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/60 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <p className="text-sm text-muted">{formatDate(p.date)} · {p.readingMinutes} min read</p>
                <h3 className="mt-1 flex items-start justify-between gap-3 text-lg font-semibold leading-snug">
                  {p.title}
                  <ArrowUpRight size={18} className="mt-1 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-city" />
                </h3>
                <p className="mt-2 line-clamp-2 text-muted">{p.summary}</p>
              </div>
            </a>
          ))}
          {shown.length === 0 && <p className="col-span-full rounded-3xl border border-dashed border-line p-10 text-center text-muted">{current.empty}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
