"use client";
import { useEffect, useState } from "react";
import type { XMode } from "./ExperienceProvider";

export default function ModeChangeFX({ mode }: { mode: XMode }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) {
      setFlash(false);
      return;
    }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 900);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <>
      <div aria-live="polite" className="sr-only">Mode switched to {mode}</div>
      {flash && (
        <div
          className="pointer-events-none fixed top-[calc(var(--nav-height,theme(spacing.14))+4px)] right-6 z-60 sparkle-burst"
          aria-hidden
        />
      )}
    </>
  );
}


