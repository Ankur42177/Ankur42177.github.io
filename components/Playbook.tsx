import type { PostMeta } from "../lib/blog";
import BlogTabs from "./BlogTabs";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Playbook({ posts }: { posts: PostMeta[] }) {
  return (
    <Section id="playbook" eyebrow="The Playbook" title="Sports & tech, written down">
      <Reveal>
        <div className="-mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
          <p className="max-w-xl text-lg text-muted">
            Off the clock I&apos;m an avid football fan and a lifelong <span className="font-semibold text-city">Manchester City</span> 🩵
            supporter. Here I break down Pep Guardiola&apos;s ideas — and write about the AI and security work I do.
          </p>
          <a href="/blog/" className="text-sm font-medium text-muted hover:text-fg">All posts →</a>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <BlogTabs posts={posts} limit={4} />
      </Reveal>
    </Section>
  );
}
