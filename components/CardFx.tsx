"use client";
/**
 * ONE delegated pointer listener for the whole site (no per-card JavaScript).
 *  - Over any element with `data-fx="<max degrees>"` it writes --mx/--my (pointer %) and --rx/--ry (tilt)
 *    plus `data-fx-on`; CSS (.tilt in globals.css) does the drawing on the GPU.
 *  - On <html> it writes --cx/--cy so the aurora spotlight follows the cursor.
 * Skipped on touch-only devices and when the visitor prefers reduced motion.
 */
import { useEffect } from "react";

export default function CardFx() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const root = document.documentElement;
    let el: HTMLElement | null = null;
    let frame = 0;
    let x = 0;
    let y = 0;

    const reset = (t: HTMLElement) => {
      for (const p of ["--mx", "--my", "--rx", "--ry"]) t.style.removeProperty(p);
      t.removeAttribute("data-fx-on");
    };

    const apply = () => {
      frame = 0;
      root.style.setProperty("--cx", `${x}px`);
      root.style.setProperty("--cy", `${y}px`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (x - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (y - r.top) / r.height));
      const max = Number(el.dataset.fx) || 6;
      const s = el.style;
      s.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      s.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      s.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
      s.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
      el.setAttribute("data-fx-on", "");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      const target = (e.target as Element | null)?.closest?.<HTMLElement>("[data-fx]") ?? null;
      if (target !== el) {
        if (el) reset(el);
        el = target;
      }
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (el) reset(el);
      el = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      if (frame) cancelAnimationFrame(frame);
      onLeave();
    };
  }, []);
  return null;
}
