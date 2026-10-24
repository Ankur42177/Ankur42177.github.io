"use client";

import { useState } from "react";
import { Copy, Check, Mail, Phone, Send } from "lucide-react";
import { profile } from "../lib/data";
import Reveal from "./Reveal";
import Section from "./Section";

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard?.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
    >
      {done ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", company: "", message: "" });

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Opportunity for Ankur — from ${form.name}${form.company ? ` (${form.company})` : ""}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.message)}`;
  };

  const input = "w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 outline-none focus:border-neutral-900";

  return (
    <Section id="contact" eyebrow="Contact" title="Let's work together">
      <Reveal>
        <p className="-mt-6 mb-10 max-w-xl text-lg text-neutral-600">
          Recruiters and collaborators — I&apos;m open to new opportunities in AI and security engineering. Email or call me directly.
        </p>
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            <a href={`mailto:${profile.email}?subject=${encodeURIComponent("Opportunity for Ankur")}`}
              className="card flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Mail size={20} /></span>
              <span className="flex-1">
                <span className="block text-sm text-neutral-500">Email</span>
                <span className="font-medium break-all">{profile.email}</span>
              </span>
              <CopyButton text={profile.email} />
            </a>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="card flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Phone size={20} /></span>
                <span className="flex-1">
                  <span className="block text-sm text-neutral-500">Phone</span>
                  <span className="font-medium">{profile.phone}</span>
                </span>
                <CopyButton text={profile.phone} />
              </a>
            )}
            <div className="flex gap-3">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn-ghost flex-1 justify-center">GitHub</a>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={send} className="card space-y-3">
            <h3 className="font-semibold">Send a quick message</h3>
            <input required placeholder="Your name" className={input}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Company (optional)" className={input}
              value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <textarea required rows={4} placeholder="Tell me about the role…" className={input}
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button type="submit" className="btn w-full justify-center"><Send size={16} /> Send email</button>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
