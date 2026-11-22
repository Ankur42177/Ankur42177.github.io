"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { profile } from "../lib/data";
import { startPlay } from "./PlayToggle";

const orbitIcons = ["☕", "🧠", "🛡️", "⚙️", "🐘", "⚽"];

/** Types one phrase, waits, deletes it, moves to the next. Shows the first phrase still when motion is reduced. */
function useTypewriter(words: string[]) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, i = words[0].length, deleting = true, timer = 0;
    const tick = () => {
      let wait: number;
      if (deleting) {
        i--;
        wait = 35;
        if (i === 0) { deleting = false; w = (w + 1) % words.length; wait = 350; }
      } else {
        i++;
        wait = 70;
        if (i === words[w].length) { deleting = true; wait = 1900; }
      }
      setText(words[w].slice(0, i));
      timer = window.setTimeout(tick, wait);
    };
    timer = window.setTimeout(tick, 2200);
    return () => window.clearTimeout(timer);
  }, [words]);
  return text;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } };
const item = { hidden: { opacity: 0, y: 22, filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } } };

export default function Hero() {
  const typed = useTypewriter(profile.rotating);

  return (
    <section id="top" className="relative flex min-h-[min(92vh,940px)] flex-col items-center justify-center pt-20 text-center">
      {/* avatar with a sweeping light ring and orbiting tech */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative mb-10 grid h-56 w-56 place-items-center"
      >
        <div className="orbit absolute inset-0 rounded-full border border-dashed border-line">
          {orbitIcons.map((ic, k) => {
            const a = (k / orbitIcons.length) * Math.PI * 2;
            return (
              <span key={ic} className="glass absolute grid h-9 w-9 place-items-center rounded-full text-base"
                style={{ left: `calc(50% + ${Math.cos(a) * 50}% - 18px)`, top: `calc(50% + ${Math.sin(a) * 50}% - 18px)` }}>
                {ic}
              </span>
            );
          })}
        </div>
        <div className="absolute inset-8 -z-10 rounded-full bg-gradient-to-tr from-iris via-aqua to-coral opacity-40 blur-2xl" />
        <motion.div
          animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="glass frame-sweep grid h-32 w-32 place-items-center rounded-full text-6xl"
        >
          👨‍💻
        </motion.div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
          Open to backend, systems &amp; AI engineering roles
        </motion.p>
        <motion.p variants={item} className="mt-6 text-xl text-muted md:text-2xl">Hey, I&apos;m {profile.firstName} 👋</motion.p>
        <motion.h1 variants={item} className="mx-auto mt-2 max-w-4xl text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Backend &amp; Systems <span className="font-display text-aurora pr-2 text-[1.1em]">Software</span> Engineer
        </motion.h1>
        <motion.p variants={item} className="mt-5 text-lg md:text-xl">
          I build <span className="caret font-semibold text-accent-2">{typed}</span>
        </motion.p>
        <motion.p variants={item} className="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 text-muted">
          {profile.title} · {profile.company} <span className="mx-1">·</span> <MapPin size={15} /> {profile.location}
        </motion.p>
        <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-lg text-muted">{profile.tagline}</motion.p>

        <motion.div variants={item} className="mt-9 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn">Get in touch <ArrowRight size={16} /></a>
          <a href={profile.resume} download="Ankur_Kumar_Resume.pdf" className="btn-ghost"><Download size={16} /> Download resume</a>
          <button type="button" onClick={startPlay} className="btn-ghost">⚽ Play mode</button>
        </motion.div>
      </motion.div>

      <motion.a href="#projects" aria-label="Scroll to projects"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.4 }, y: { duration: 2, repeat: Infinity } }}
        className="mt-16 grid h-11 w-11 place-items-center rounded-full border border-line text-muted hover:text-fg">
        <ArrowDown size={18} />
      </motion.a>
    </section>
  );
}
