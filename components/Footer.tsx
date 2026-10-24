import { profile } from "../lib/data";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 py-10 text-center text-sm text-neutral-500">
      © {new Date().getFullYear()} {profile.name} · Built with Next.js & Tailwind CSS
    </footer>
  );
}
