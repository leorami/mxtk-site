"use client";
import { PropsWithChildren } from "react";

export default function PageHero({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="glass p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
