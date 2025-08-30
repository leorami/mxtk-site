"use client";
import { PropsWithChildren, useEffect } from "react";

export default function PageTheme({
  ink = "dark",
  lift = "none",
  children,
}: PropsWithChildren<{ ink?: "dark" | "light" | "warm"; lift?: "none" | "L" | "M" | "H" }>) {
  useEffect(() => {
    const el = document.documentElement;
    // set active values
    el.dataset.ink = ink;
    el.dataset.lift = lift === "none" ? "" : lift;
    // expose page defaults so the dev switcher can “Reset to page”
    el.dataset.pageInk = ink;
    el.dataset.pageLift = lift;
    return () => {
      delete el.dataset.ink;
      delete el.dataset.lift;
      delete el.dataset.pageInk;
      delete el.dataset.pageLift;
    };
  }, [ink, lift]);

  return <>{children}</>;
}


