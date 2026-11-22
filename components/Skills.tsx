"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { skills } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

// Hover (or focus) a skill and every card that shares it lights up; the rest dim.
export default function Skills() {
  const [hot, setHot] = useState<string | null>(null);

  return (
    <Section id="skills" eyebrow="Skills" title="What I *work* with">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skills).map(([group, items], i) => {
          const dim = hot !== null && !items.includes(hot);
          return (
            <Reveal key={group} delay={i * 0.06}>
              <div className={`card tilt h-full transition-opacity duration-300 ${dim ? "opacity-40" : ""}`} data-fx="6">
                <h3 className="mb-4 font-semibold">{group}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((s, k) => (
                    <motion.span key={s} tabIndex={0}
                      initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ delay: 0.1 + k * 0.03 }}
                      onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)}
                      onFocus={() => setHot(s)} onBlur={() => setHot(null)}
                      className={`chip cursor-default transition-colors ${hot === s ? "!border-accent !text-fg" : ""}`}>
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
