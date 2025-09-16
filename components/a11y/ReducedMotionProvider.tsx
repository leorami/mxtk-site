"use client";
import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext(false);
export default function ReducedMotionProvider({ children }:{ children: React.ReactNode }){
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    try {
      const q = window.matchMedia("(prefers-reduced-motion: reduce)");
      const upd = () => setReduce(q.matches);
      upd(); q.addEventListener?.("change", upd);
      return () => q.removeEventListener?.("change", upd);
    } catch {}
  }, []);
  useEffect(() => {
    try { document.body.dataset.motion = reduce ? "reduce" : "no-preference"; } catch {}
  }, [reduce]);
  return <Ctx.Provider value={reduce}>{children}</Ctx.Provider>;
}
export const useReducedMotion = () => useContext(Ctx);


