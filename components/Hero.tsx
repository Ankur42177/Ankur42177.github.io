"use client";

import { motion } from "framer-motion";
import TypingEffect from "./TypingEffect";

<TypingEffect />

export default function Hero() {
  return (
    <section
      className="
      min-h-screen
      flex
      flex-col
      justify-center
      items-center
      text-center
      px-6
      bg-gradient-to-b
      from-black
      via-zinc-950
      to-black
    "
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="uppercase tracking-[0.4em] text-yellow-500 mb-4">
          
        </p>

        <h1
          className="
          text-6xl
          md:text-8xl
          font-black
          text-yellow-400
          drop-shadow-[0_0_35px_rgba(255,215,0,0.7)]
        "
        >
          ANKUR KUMAR
        </h1>

        <p className="mt-6 text-2xl text-gray-300">
          Software Engineer @ Trellix
        </p>

        <p className="mt-4 text-lg text-gray-400">
          AI Engineer • Security Engineer • Backend Engineer
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <a
            href="/resume.pdf"
            download
            className="
              bg-yellow-400
              text-black
              px-8
              py-3
              rounded-xl
              font-semibold
            "
          >
            Download Resume
          </a>

          <a
            href="https://github.com/Ankur42177"
            target="_blank"
            rel="noopener noreferrer"
            className="
              border
              border-yellow-500
              px-8
              py-3
              rounded-xl
            "
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/ankur-kumar-007/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              border
              border-blue-500
              px-8
              py-3
              rounded-xl
            "
          >
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}