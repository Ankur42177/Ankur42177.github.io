import Reveal from "./Reveal";

export default function Section({ id, eyebrow, title, children }: {
  id: string; eyebrow: string; title: string; children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20">
      <Reveal>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500">{eyebrow}</p>
        <h2 className="mb-10 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}
