import type { Metadata } from "next";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import Reveal from "../../../components/Reveal";
import { formatDate, getAllPosts, getPost } from "../../../lib/blog";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { meta } = getPost((await params).slug);
  return { title: `${meta.title} — Ankur Kumar`, description: meta.summary };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { meta, html } = getPost((await params).slug);
  return (
    <div className="theme-sky min-h-screen">
      <Navbar base="/" />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <Reveal>
          <a href="/blog/" className="text-sm text-muted hover:text-fg">← The Playbook</a>
          <div className="mt-8 flex flex-wrap gap-2">
            {meta.tags.map((t) => <span key={t} className="rounded-full bg-city/15 px-3 py-1 text-sm font-medium text-sky-800 dark:text-sky-200">{t}</span>)}
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">{meta.title}</h1>
          <p className="mt-4 text-muted">By Ankur Kumar · {formatDate(meta.date)} · {meta.readingMinutes} min read</p>
        </Reveal>
        {meta.cover && (
          <Reveal delay={0.05}>
            <figure className="mt-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={meta.cover} alt={meta.coverAlt ?? meta.title}
                style={{ objectPosition: meta.coverPosition ?? "center" }}
                className="aspect-[16/9] w-full rounded-3xl border border-line object-cover shadow-xl shadow-sky-900/10" />
              {meta.coverCredit && (
                <figcaption className="mt-2 text-xs text-muted">
                  Photo: {meta.coverCreditUrl ? <a href={meta.coverCreditUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{meta.coverCredit}</a> : meta.coverCredit}
                </figcaption>
              )}
            </figure>
          </Reveal>
        )}
        <Reveal delay={0.1}>
          <article className="prose-blog mt-10" dangerouslySetInnerHTML={{ __html: html }} />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
