"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { profile, stats } from "../lib/data";

export default function Hero() {
  return (
    <section id="top" className="flex min-h-[min(88vh,900px)] flex-col items-center justify-center pt-16 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-sky-200 via-violet-200 to-amber-100 blur-2xl" />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-36 w-36 place-items-center rounded-full border border-white bg-white/70 text-7xl shadow-lg"
        >
          👨‍💻
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <p className="text-xl text-neutral-600 md:text-2xl">Hey, I&apos;m {profile.firstName} 👋</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight md:text-7xl">{profile.role}</h1>
        <p className="mt-3 inline-flex items-center gap-1.5 text-neutral-500">
          Software Engineer @ {profile.company} <span className="mx-1">·</span> <MapPin size={15} /> {profile.location}
        </p>
        <p className="mx-auto mt-6 max-w-xl text-lg text-neutral-600">{profile.tagline}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#contact" className="btn">Get in touch <ArrowRight size={16} /></a>
          <a href={profile.resume} download="Ankur_Kumar_Resume.pdf" className="btn-ghost"><Download size={16} /> Download resume</a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4"
      >
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-neutral-200 bg-white px-4 py-5">
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-sm text-neutral-500">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
