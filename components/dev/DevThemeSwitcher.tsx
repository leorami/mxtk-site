"use client";
import AppImage from '@/components/ui/AppImage';
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

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
    const line = `${pageSlug}: ink=${effectiveInk} lift=${effectiveLift} glass=${effectiveGlass}`;
    navigator.clipboard?.writeText(line);
    console.log("[DevThemeSwitcher] " + line);
  };

  // The beautiful compact widget - button stays in footer, dropdown floats over page
  const dropdown = open && typeof document !== 'undefined' ? createPortal(
    <div
      className="glass p-3 rounded-xl w-[220px] shadow-2xl backdrop-blur-xl border border-white/10 fixed z-[9999] bottom-20"
      style={{ position: 'absolute', left: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium text-sm">Dev Theme</div>
        <button onClick={() => setOpen(false)} className="text-xs opacity-70 hover:opacity-100">Close</button>
      </div>

      <label className="flex items-center gap-2 mb-2 text-xs">
        <input
          type="checkbox"
          checked={override}
          onChange={(e) => setOverride(e.target.checked)}
        />
        Override page defaults
      </label>

      <div className="grid grid-cols-2 gap-1 mb-2 text-xs">
        <div className="opacity-70">Ink</div>
        <select
          className="glass px-2 py-1 rounded text-xs backdrop-blur-sm border border-white/5"
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
          className="glass px-2 py-1 rounded text-xs backdrop-blur-sm border border-white/5"
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
          className="glass px-2 py-1 rounded text-xs backdrop-blur-sm border border-white/5"
          value={glass}
          onChange={(e) => setGlass(e.target.value as Glass)}
          disabled={!override}
        >
          <option value="soft">soft</option>
          <option value="standard">standard</option>
          <option value="strong">strong</option>
        </select>
      </div>

      <div className="flex items-center justify-between gap-1 mt-2">
        <button
          className="glass px-2 py-1 rounded text-[10px] backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-colors"
          onClick={() => { setOverride(false); }}
          title={`Reset to page defaults (ink=${pageInk}, lift=${pageLift}, glass=${pageGlass})`}
        >
          Reset to page
        </button>
        <button className="glass px-2 py-1 rounded text-[10px] backdrop-blur-sm border border-white/5 hover:bg-white/5 transition-colors" onClick={copyMapping}>
          Copy mapping
        </button>
      </div>

      <div className="mt-1 text-[10px] opacity-70">
        {pageSlug}: ink=<b>{effectiveInk}</b> lift=<b>{effectiveLift}</b> glass=<b>{effectiveGlass}</b>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="nav-link nav-pill inline-flex items-center justify-center w-12 h-12"
        style={{ ['--hover-bg' as any]: 'var(--mxtk-hover-bg)' }}
        title="Theme switcher (Alt+T)"
      >
        <AppImage
          src="/art/mxtk_micro_mark_20.svg"
          alt="MXTK Logo"
          width={20}
          height={20}
          style={{ width: "auto", height: "auto" }}
          className="w-5 h-5 opacity-90"
        />
      </button>
      {dropdown}
    </>
  );
}