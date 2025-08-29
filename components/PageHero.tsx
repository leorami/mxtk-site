"use client";
import type { PropsWithChildren } from "react";

export default function PageHero({ children }: PropsWithChildren) {
  return (
    <div className="relative container mx-auto px-4 pt-8 pb-8">
      <div className="glass p-6 md:p-8">{children}</div>
    </div>
  );
}
