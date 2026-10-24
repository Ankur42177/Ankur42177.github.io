import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Blog posts are Markdown files in content/blog/. Each file starts with a
// front-matter block (title, date, summary, tags, category: sports|tech, and an
// optional cover image with credit) between --- lines.
const DIR = path.join(process.cwd(), "content/blog");

export type Category = "sports" | "tech";

export type PostMeta = {
  slug: string; title: string; date: string; summary: string; tags: string[]; readingMinutes: number;
  category: Category;
  cover?: string; coverAlt?: string; coverPosition?: string; coverCredit?: string; coverCreditUrl?: string;
};

function parse(file: string) {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing front matter in ${file}`);
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  const body = match[2];
  return {
    meta: {
      slug: file.replace(/\.md$/, ""),
      title: meta.title ?? file,
      date: meta.date ?? "",
      summary: meta.summary ?? "",
      tags: (meta.tags ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      readingMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
      category: meta.category === "tech" ? "tech" : "sports",
      cover: meta.cover,
      coverAlt: meta.coverAlt,
      coverPosition: meta.coverPosition,
      coverCredit: meta.coverCredit,
      coverCreditUrl: meta.coverCreditUrl,
    } satisfies PostMeta,
    body,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => parse(f).meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  const { meta, body } = parse(`${slug}.md`);
  return { meta, html: marked.parse(body, { async: false }) as string };
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
