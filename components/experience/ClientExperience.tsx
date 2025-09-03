"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { XMode } from "./ExperienceProvider";

const ExperienceCtx = createContext<{ mode: XMode; setMode: (m: XMode) => void; }>({
  mode: "build",
  setMode: () => {}
});

export default function ClientExperience({ initial, children }:{ initial: XMode; children: React.ReactNode }) {
  const [mode, setMode] = useState<XMode>(initial);

  useEffect(() => { document.documentElement.dataset.xmode = mode; }, [mode]);
  useEffect(() => {
    document.cookie = `mxtk.xmode=${mode}; path=/; max-age=31536000; samesite=lax`;
  }, [mode]);

  return <ExperienceCtx.Provider value={{ mode, setMode }}>{children}</ExperienceCtx.Provider>;
}

export function useExperience() { return useContext(ExperienceCtx); }


