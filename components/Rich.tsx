// Renders text where **double stars** mark a highlighted phrase or metric. No HTML is ever injected.
export default function Rich({ text, className = "font-semibold text-fg" }: { text: string; className?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i} className={className}>{p}</strong> : p))}
    </>
  );
}
