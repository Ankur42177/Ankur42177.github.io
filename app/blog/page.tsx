import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Reveal from "../../components/Reveal";
import BlogTabs from "../../components/BlogTabs";
import { getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  title: "The Playbook — Ankur Kumar",
  description: "Sports and tech writing by Ankur Kumar: Manchester City tactics, AI and security.",
};

export default function BlogIndex() {
  return (
    <div className="theme-sky min-h-screen">
      <Navbar base="/" />
      <main className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-city">The Playbook</p>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">Sports & tech, written down 🩵</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Tactical breakdowns from the Etihad and notes from my work in AI and security engineering.
          </p>
        </Reveal>
        <div className="mt-12">
          <BlogTabs posts={getAllPosts()} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
