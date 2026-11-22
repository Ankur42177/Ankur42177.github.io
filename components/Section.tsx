import Reveal from "./Reveal";

// `title` may contain one *accent* word (single stars), rendered in the serif italic with the aurora gradient.
export default function Section({ id, eyebrow, title, intro, children }: {
  id: string; eyebrow: string; title: string; intro?: React.ReactNode; children: React.ReactNode;
}) {
  const parts = title.split(/\*(.+?)\*/g);
  return (
    <section id={id} className="scroll-mt-24 py-24">
      <Reveal>
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.22em] text-accent-2">
          <span className="h-px w-6 bg-current" />{eyebrow}
        </p>
        <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
          {parts.map((p, i) => (i % 2 === 1 ? <span key={i} className="font-display text-aurora pr-1 text-[1.12em]">{p}</span> : p))}
        </h2>
        {intro && <p className="mt-4 max-w-2xl text-lg text-muted">{intro}</p>}
      </Reveal>
      <div className="mt-12">{children}</div>
    </section>
  );
}
