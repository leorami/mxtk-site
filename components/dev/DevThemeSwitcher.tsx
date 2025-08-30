"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Ink = "dark" | "light" | "warm";
type Lift = "none" | "L" | "M" | "H";

export default function DevThemeSwitcher() {
  // only show in development by default
  if (process.env.NODE_ENV === "production") return null;

  const doc = typeof document !== "undefined" ? document.documentElement : null;

  // read page defaults (set by PageTheme)
  const pageInk = (doc?.dataset.pageInk as Ink) || "dark";
  const pageLift = (doc?.dataset.pageLift as Lift) || "none";

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

  // apply whenever values change
  useEffect(() => {
    if (!doc) return;
    const apply = (i: Ink, l: Lift) => {
      doc.dataset.ink = i;
      doc.dataset.lift = l === "none" ? "" : l;
    };
    if (override) apply(ink, lift);
    else apply(pageInk, pageLift);
  }, [override, ink, lift, doc, pageInk, pageLift]);

  // persist
  useEffect(() => {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem("mxtk.dev.override", override ? "1" : "0");
    if (override) {
      localStorage.setItem("mxtk.dev.ink", ink);
      localStorage.setItem("mxtk.dev.lift", lift);
    } else {
      localStorage.removeItem("mxtk.dev.ink");
      localStorage.removeItem("mxtk.dev.lift");
    }
  }, [override, ink, lift]);

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

  const copyMapping = () => {
    const line = `${pageSlug}: ink=${effectiveInk} lift=${effectiveLift}`;
    navigator.clipboard?.writeText(line);
    console.log("[DevThemeSwitcher] " + line);
  };

  // minimal UI
  return (
    <div className="fixed z-[100] bottom-4 right-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="glass px-3 py-2 text-sm rounded-full shadow-md"
          title="Theme switcher (Alt+T)"
        >
          Theme
        </button>
      ) : (
        <div className="glass p-3 md:p-4 rounded-xl min-w-[220px]">
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
              className="glass px-2 py-1 rounded"
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
              className="glass px-2 py-1 rounded"
              value={lift}
              onChange={(e) => setLift(e.target.value as Lift)}
              disabled={!override}
            >
              <option value="none">none</option>
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="H">H</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-2 mt-3">
            <button
              className="glass px-2 py-1 rounded text-xs"
              onClick={() => { setOverride(false); }}
              title={`Reset to page defaults (ink=${pageInk}, lift=${pageLift})`}
            >
              Reset to page
            </button>
            <button className="glass px-2 py-1 rounded text-xs" onClick={copyMapping}>
              Copy mapping
            </button>
          </div>

          <div className="mt-2 text-[11px] opacity-70">
            {pageSlug}: ink=<b>{effectiveInk}</b> lift=<b>{effectiveLift}</b>
          </div>
        </div>
      )}
    </div>
  );
}


