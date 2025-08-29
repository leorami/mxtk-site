"use client";
import type { PropsWithChildren } from "react";

export default function PageHero({ children }: PropsWithChildren) {
  return (
    <div className="relative container mx-auto px-4 pt-10 pb-8">
      <div className="glass p-6 md:p-8 bg-white/70 dark:bg-slate-950/55 backdrop-blur-xl backdrop-saturate-150 ring-1 ring-black/5 dark:ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,.10)]">{children}</div>
    </div>
  );
}
