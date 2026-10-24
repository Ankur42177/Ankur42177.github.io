import { skills } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="What I work with">
      <div className="grid gap-5 md:grid-cols-2">
        {Object.entries(skills).map(([group, items], i) => (
          <Reveal key={group} delay={i * 0.08}>
            <div className="card h-full">
              <h3 className="mb-4 font-semibold">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => <span key={s} className="chip bg-soft">{s}</span>)}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
