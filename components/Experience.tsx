import { Briefcase } from "lucide-react";
import { experience } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've worked">
      <div className="relative border-l border-neutral-200 pl-8">
        {experience.map((e) => (
          <Reveal key={e.company + e.period}>
            <div className="relative pb-10">
              <span className="absolute -left-[49px] grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white">
                <Briefcase size={15} />
              </span>
              <div className="card">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-semibold">
                    {e.role} <span className="text-neutral-400">@</span> {e.company}
                  </h3>
                  <span className="text-sm text-neutral-500">{e.period}</span>
                </div>
                <p className="text-sm text-neutral-500">{e.location}</p>
                <ul className="mt-4 space-y-2 text-neutral-700">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />{pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
