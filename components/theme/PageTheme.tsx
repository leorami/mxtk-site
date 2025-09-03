"use client";
import { PropsWithChildren, useEffect } from "react";

export default function PageTheme({
  ink = "dark",
  lift = "none",
  glass = "standard",
  children,
}: PropsWithChildren<{ ink?: "dark" | "light" | "warm"; lift?: "none" | "L" | "M" | "H"; glass?: "soft" | "standard" | "strong" }>) {
  useEffect(() => {
    const el = document.documentElement;
    // set active values
    el.dataset.ink = ink;
    el.dataset.lift = lift === "none" ? "" : lift;
    el.dataset.glass = glass;
    // expose page defaults so the dev switcher can “Reset to page”
    el.dataset.pageInk = ink;
    el.dataset.pageLift = lift;
    el.dataset.pageGlass = glass;
    return () => {
      delete el.dataset.ink;
      delete el.dataset.lift;
      delete el.dataset.glass;
      delete el.dataset.pageInk;
      delete el.dataset.pageLift;
      delete el.dataset.pageGlass;
    };
  }, [ink, lift, glass]);

  return <>{children}</>;
}


