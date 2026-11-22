"use client";
/**
 * Play mode switch. The physics code (play/PlayField) is NOT in the main bundle: it is fetched with import()
 * the first time someone switches Play on. Any component can start it with startPlay() (a window event).
 */
import { useCallback, useEffect, useState } from "react";
import type { ComponentType } from "react";

const EVENT = "portfolio:play";
export function startPlay() {
  window.dispatchEvent(new Event(EVENT));
}

type FieldProps = { onStop: () => void };

export default function PlayToggle() {
  const [Field, setField] = useState<ComponentType<FieldProps> | null>(null);
  const [on, setOn] = useState(false);
  const [note, setNote] = useState("");

  const stop = useCallback(() => setOn(false), []);

  const turnOn = useCallback(async () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setNote("Play mode is resting: your device asks for reduced motion.");
      window.setTimeout(() => setNote(""), 3500);
      return;
    }
    if (!Field) {
      const mod = await import("./play/PlayField");
      setField(() => mod.default);
    }
    setOn(true);
  }, [Field]);

  useEffect(() => {
    const h = () => void turnOn();
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, [turnOn]);

  return (
    <>
      <button type="button" onClick={() => (on ? stop() : void turnOn())} aria-pressed={on}
        title="Play mode: rain footballs and tech orbs on the page"
        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm transition ${on ? "bg-coral text-white" : "text-muted hover:bg-soft hover:text-fg"}`}>
        <span aria-hidden="true" className={on ? "inline-block animate-spin [animation-duration:3s]" : ""}>⚽</span>
        <span className="hidden lg:inline">Play</span>
      </button>
      {on && Field && <Field onStop={stop} />}
      {note && (
        <p role="status" className="glass fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 text-sm">{note}</p>
      )}
    </>
  );
}
