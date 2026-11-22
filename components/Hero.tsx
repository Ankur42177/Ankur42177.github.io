"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { profile } from "../lib/data";
import { startPlay } from "./PlayToggle";
import HeroCanvas from "./HeroCanvas";

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


const chips = [
  { text: "☕ Spring Boot · 100K+ endpoints", x: "-9%", y: "18%", depth: 30, delay: 0 },
  { text: "📉 ~90% fewer duplicate policies", x: "-11%", y: "46%", depth: 18, delay: 0.6 },
  { text: "🧠 RAG · pgvector · MCP", x: "-7%", y: "74%", depth: 40, delay: 1.2 },
  { text: "⚡ Kafka · transactional outbox", x: "85%", y: "16%", depth: 36, delay: 0.3 },
  { text: "🛡️ C++ kernel drivers", x: "89%", y: "44%", depth: 22, delay: 0.9 },
  { text: "🏆 $5K Hack-AI-Thon", x: "87%", y: "72%", depth: 32, delay: 1.5 },
];

function FloatChip({ c, mx, my }: { c: (typeof chips)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * c.depth);
  const y = useTransform(my, (v) => v * c.depth);
  return (
    <motion.div style={{ left: c.x, top: c.y, x, y }} className="absolute hidden min-[1400px]:block"
      initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 + c.delay * 0.4, type: "spring", stiffness: 120, damping: 14 }}>
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4 + c.delay, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
        className="glass tilt whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium" data-fx="14">
        {c.text}
      </motion.div>
    </motion.div>
  );
}

function Letters({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span aria-hidden="true" className="inline-block">
      {[...text].map((ch, i) => (
        <motion.span key={i} className="inline-block"
          initial={{ opacity: 0, y: 40, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.045, type: "spring", stiffness: 200, damping: 16 }}
          whileHover={{ y: -8, color: "#2cc6cf", transition: { duration: 0.15 } }}>
          {ch === " " ? "\u00a0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const typed = useTypewriter(profile.rotating);
  const rawX = useMotionValue(0), rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  const onMove = (e: React.PointerEvent) => {
    rawX.set(e.clientX / window.innerWidth - 0.5);
    rawY.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section id="top" onPointerMove={onMove} className="relative isolate flex min-h-[min(94vh,960px)] flex-col items-center justify-center pt-20 text-center">
      <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2"><HeroCanvas /></div>
      {chips.map((c) => <FloatChip key={c.text} c={c} mx={mx} my={my} />)}
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
          Open to software development &amp; AI roles
        </motion.p>
        <motion.p variants={item} className="mt-6 text-xl text-muted md:text-2xl">Hey, I&apos;m {profile.firstName} 👋</motion.p>
        <h1 className="mx-auto mt-2 max-w-4xl text-balance text-6xl font-bold tracking-tight [perspective:600px] md:text-7xl lg:text-8xl" aria-label={profile.role}>
          <Letters text="Software" delay={0.45} />{" "}
          <motion.span aria-hidden="true" className="font-display text-aurora inline-block pr-3 text-[1.1em]"
            initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            Developer
          </motion.span>
        </h1>
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
