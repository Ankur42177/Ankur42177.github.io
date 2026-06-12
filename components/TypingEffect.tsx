"use client";

import { TypeAnimation } from "react-type-animation";

export default function TypingEffect() {
  return (
    <TypeAnimation
      sequence={[
        "Agentic AI Builder",
        2000,
        "Windows Driver Engineer",
        2000,
        "RAG Architect",
        2000,
        "Security Engineer",
        2000,
        "Spring Boot Developer",
        2000,
      ]}
      wrapper="span"
      speed={50}
      repeat={Infinity}
      className="text-yellow-400 text-2xl font-semibold"
    />
  );
}