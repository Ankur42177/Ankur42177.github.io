"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "../lib/data";
import ThemeToggle from "./ThemeToggle";
import PlayToggle from "./PlayToggle";

const links = [
  { id: "top", label: "Me" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "lab", label: "Lab" },
  { id: "skills", label: "Skills" },
  { id: "playbook", label: "Playbook" },
  { id: "contact", label: "Contact" },
];

// `base` lets the blog pages link back to sections on the home page.
export default function Navbar({ base = "" }: { base?: string }) {
  const [active, setActive] = useState(base ? "playbook" : "top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

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
    <>
      {!base && (
        <motion.div aria-hidden="true" style={{ scaleX: progress }}
          className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-iris via-aqua to-coral" />
      )}
      <header className="sticky top-4 z-50 mx-auto flex max-w-6xl justify-center px-5">
        <motion.nav
          initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="glass nav-glass flex items-center gap-0.5 rounded-full p-1.5">
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
          <span className="mx-1 h-5 w-px bg-line" />
          <PlayToggle />
          <ThemeToggle />
          <a href={profile.resume} download="Ankur_Kumar_Resume.pdf"
            className="ml-0.5 inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm font-medium transition hover:border-accent">
            <Download size={14} /> <span className="hidden sm:inline">Resume</span>
          </a>
        </motion.nav>
      </header>
    </>
  );
}
