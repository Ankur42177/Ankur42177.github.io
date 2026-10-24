"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "../lib/data";
import ThemeToggle from "./ThemeToggle";

const links = [
  { id: "top", label: "Me" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "hobbies", label: "Football" },
  { id: "contact", label: "Contact" },
];

// `base` lets the blog pages link back to sections on the home page.
export default function Navbar({ base = "" }: { base?: string }) {
  const [active, setActive] = useState(base ? "hobbies" : "top");

  useEffect(() => {
    if (base) return;
    // Scroll-spy: highlight the section currently in the middle of the viewport.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    links.forEach((l) => { const el = document.getElementById(l.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [base]);

  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-5xl justify-center px-5">
      <motion.nav
        initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }}
        className="flex items-center gap-0.5 rounded-full border border-line bg-card/80 p-1.5 shadow-sm backdrop-blur-xl">
        {links.map((l) => (
          <a key={l.id} href={`${base}#${l.id}`} onClick={() => setActive(l.id)}
            className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
              l.id === "contact" ? "" : "hidden md:block"
            } ${active === l.id ? "text-bg" : "text-muted hover:text-fg"}`}>
            {active === l.id && (
              <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-fg"
                transition={{ type: "spring", stiffness: 380, damping: 30 }} />
            )}
            <span className="relative z-10">{l.label}</span>
          </a>
        ))}
        <ThemeToggle />
        <a href={profile.resume} download="Ankur_Kumar_Resume.pdf"
          className="ml-0.5 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition hover:border-fg">
          <Download size={14} /> Resume
        </a>
      </motion.nav>
    </header>
  );
}
