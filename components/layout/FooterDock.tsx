"use client";
import ExperienceToggle from "@/components/ExperienceToggle";
import ThemeToggle from "@/components/ThemeToggle";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function FooterDock(){
  const lastY = useRef(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastY.current && y - lastY.current > 6);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="region"
      aria-label="App controls"
      className={clsx(
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-200 pointer-events-none",
        hidden ? "translate-y-full" : "translate-y-0"
      )}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 8px)" }}
    >
      <div className="mx-auto max-w-screen-sm px-[var(--gutter-sm)] pointer-events-auto">
        <div className="rounded-2xl bg-[color-mix(in_oKLCH,canvas,transparent_40%)] backdrop-blur-md shadow-lg border border-white/10 px-4 py-2 flex items-center justify-between" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) * 0.5)' }}>
          <div className="shrink-0"><ThemeToggle /></div>
          <div className="min-w-0 flex-1 mx-3 overflow-hidden">
            <ExperienceToggle className="w-full truncate" />
          </div>
          <div className="opacity-70 text-sm" />
        </div>
      </div>
    </div>
  );
}


