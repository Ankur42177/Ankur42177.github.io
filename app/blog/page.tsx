import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import { formatDate, getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "Football Blog — Ankur Kumar",
  description: "Tactical writing on Manchester City and Pep Guardiola.",
};

export default function BlogIndex() {
  const posts = getAllPosts();
  return (
    <>
      <Navbar base="/" />
      <main className="mx-auto max-w-3xl px-5 py-20">
        <Reveal>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-muted">Football blog</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Notes from the Etihad 🩵</h1>
          <p className="mt-4 text-lg text-muted">Tactics, systems and stories from Manchester City and Pep Guardiola.</p>
        </Reveal>
        <div className="mt-12 space-y-5">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <a href={`/blog/${p.slug}/`} className="card block">
                <p className="text-sm text-muted">{formatDate(p.date)} · {p.readingMinutes} min read</p>
                <h2 className="mt-1 text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-muted">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </a>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
