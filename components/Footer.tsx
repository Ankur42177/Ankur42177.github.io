import { profile } from "../lib/data";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-line py-10 text-center text-sm text-muted">
      © {new Date().getFullYear()} · Designed & developed by {profile.name}
    </footer>
  );
}
