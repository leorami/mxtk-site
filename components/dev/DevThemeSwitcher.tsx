"use client";
import AppImage from '@/components/ui/AppImage';
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Ink = "dark" | "light" | "warm";
type Lift = "none" | "L" | "M" | "H";
type Glass = "soft" | "standard" | "strong";

export default function DevThemeSwitcher() {
  // only show in development by default
  if (process.env.NODE_ENV === "production") return null;

  const doc = typeof document !== "undefined" ? document.documentElement : null;

  // read page defaults (set by PageTheme)
  const pageInk = (doc?.dataset.pageInk as Ink) || "dark";
  const pageLift = (doc?.dataset.pageLift as Lift) || "none";
  const pageGlass = (doc?.dataset.pageGlass as Glass) || "standard";

  // restore prior dev override if present
  const [open, setOpen] = useState(false);
  const [override, setOverride] = useState(
    (typeof localStorage !== "undefined" && localStorage.getItem("mxtk.dev.override") === "1") || false
  );
  const [ink, setInk] = useState<Ink>(
    ((typeof localStorage !== "undefined" && (localStorage.getItem("mxtk.dev.ink") as Ink)) ||
      (doc?.dataset.ink as Ink) ||
      "dark") as Ink
  );
  const [lift, setLift] = useState<Lift>(
    ((typeof localStorage !== "undefined" && (localStorage.getItem("mxtk.dev.lift") as Lift)) ||
      (doc?.dataset.lift as Lift) ||
      "none") as Lift
  );
  const [glass, setGlass] = useState<Glass>(
    ((typeof localStorage !== "undefined" && (localStorage.getItem("mxtk.dev.glass") as Glass)) ||
      (doc?.dataset.glass as Glass) ||
      "standard") as Glass
  );

  // apply whenever values change
  useEffect(() => {
    if (!doc) return;
    // Force a repaint by toggling a nonce attribute to ensure CSS vars recalc on Safari/WebKit too
    const apply = (i: Ink, l: Lift, g: Glass) => {
      doc.dataset.ink = i;
      doc.dataset.lift = l === "none" ? "" : l;
      doc.dataset.glass = g;
      doc.setAttribute('data-theme-nonce', String(Date.now()));
    };
    if (override) apply(ink, lift, glass);
    else apply(pageInk, pageLift, pageGlass);
  }, [override, ink, lift, glass, doc, pageInk, pageLift, pageGlass]);

  // persist
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("mxtk.dev.override", override ? "1" : "0");
    if (override) {
      localStorage.setItem("mxtk.dev.ink", ink);
      localStorage.setItem("mxtk.dev.lift", lift);
      localStorage.setItem("mxtk.dev.glass", glass);
    } else {
      localStorage.removeItem("mxtk.dev.ink");
      localStorage.removeItem("mxtk.dev.lift");
      localStorage.removeItem("mxtk.dev.glass");
    }
  }, [override, ink, lift, glass]);

  // keyboard toggle (Alt+T)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "t") setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pathname = usePathname() || "/";
  const pageSlug = useMemo(() => {
    const p = pathname.replace(/\/+$/, "");
    const segments = p.split("/");
    let last = segments.pop() || "home";
    if (last === "" || last === "mxtk") last = "home"; // treat base path as home
    return last.replace(/-/g, "_");
  }, [pathname]);

  const effectiveInk: Ink = override ? ink : pageInk;
  const effectiveLift: Lift = override ? lift : pageLift;
  const effectiveGlass: Glass = override ? glass : pageGlass;

  const copyMapping = () => {
    const line = `${pageSlug}: ink=${effectiveInk} lift=${effectiveLift}`;
    navigator.clipboard?.writeText(line);
    console.log("[DevThemeSwitcher] " + line);
  };

  // minimal UI
  return (
    <div className="fixed z-[100] bottom-4 left-16">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="glass p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center w-12 h-12"
          title="Theme switcher (Alt+T)"
        >
          <AppImage
            src="/art/mxtk_micro_mark_20.svg"
            alt="MXTK Logo"
            width={20}
            height={20}
            className="w-5 h-5 opacity-90"
          />
        </button>
      ) : (
        <div className="glass p-4 rounded-2xl min-w-[240px] shadow-2xl backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div className="font-medium">Dev Theme</div>
            <button onClick={() => setOpen(false)} className="text-xs opacity-70 hover:opacity-100">Close</button>
          </div>

          <label className="flex items-center gap-2 mb-3 text-sm">
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
            />
            Override page defaults
          </label>

          <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
            <div className="opacity-70">Ink</div>
            <select
              className="glass px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5"
              value={ink}
              onChange={(e) => setInk(e.target.value as Ink)}
              disabled={!override}
            >
              <option value="dark">dark</option>
              <option value="light">light</option>
              <option value="warm">warm</option>
            </select>

            <div className="opacity-70">Lift</div>
            <select
              className="glass px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5"
              value={lift}
              onChange={(e) => setLift(e.target.value as Lift)}
              disabled={!override}
            >
              <option value="none">none</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="H">H</option>
            </select>

            <div className="opacity-70">Glass</div>
            <select
              className="glass px-3 py-2 rounded-lg backdrop-blur-sm border border-white/5"
              value={glass}
              onChange={(e) => setGlass(e.target.value as Glass)}
              disabled={!override}
            >
              <option value="soft">soft</option>
              <option value="standard">standard</option>
              <option value="strong">strong</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3">
            <button
              className="glass px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-colors"
              onClick={() => { setOverride(false); }}
              title={`Reset to page defaults (ink=${pageInk}, lift=${pageLift}, glass=${pageGlass})`}
            >
              Reset to page
            </button>
            <button className="glass px-3 py-2 rounded-lg text-xs backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-colors" onClick={copyMapping}>
              Copy mapping
            </button>
          </div>

          <div className="mt-2 text-[11px] opacity-70">
            {pageSlug}: ink=<b>{effectiveInk}</b> lift=<b>{effectiveLift}</b> glass=<b>{effectiveGlass}</b>
          </div>
        </div>
      )}
    </div>
  );
}


