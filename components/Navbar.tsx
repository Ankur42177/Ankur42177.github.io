import { Download } from "lucide-react";
import { profile } from "../lib/data";

const links = [
  { href: "#top", label: "Me" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-4 z-50 mx-auto flex max-w-5xl justify-center px-5">
      <nav className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 p-1.5 shadow-sm backdrop-blur-xl">
        {links.map((l) => (
          <a key={l.href} href={l.href}
            className="hidden rounded-full px-4 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 sm:block">
            {l.label}
          </a>
        ))}
        <a href="#contact" className="rounded-full px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 sm:hidden">Contact</a>
        <a href={profile.resume} download="Ankur_Kumar_Resume.pdf"
          className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700">
          <Download size={14} /> Resume
        </a>
      </nav>
    </header>
  );
}
