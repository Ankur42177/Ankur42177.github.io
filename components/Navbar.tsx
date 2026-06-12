"use client";

export default function Navbar() {
  return (
    <nav className="
      fixed
      top-0
      left-0
      right-0
      z-50
      bg-black/40
      backdrop-blur-xl
      border-b
      border-white/10
    ">
      <div className="
        max-w-7xl
        mx-auto
        flex
        justify-between
        items-center
        px-8
        py-4
      ">
        <h1 className="font-bold text-xl text-yellow-400">
          BATCAVE
        </h1>

        <div className="flex gap-6">
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}