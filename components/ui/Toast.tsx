"use client";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastOptions = {
  durationMs?: number;
};

type ToastContextValue = {
  show: (message: string, options?: ToastOptions) => void;
};

const ToastCtx = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Array<{ id: number; msg: string; until: number }>>([]);
  const idRef = useRef(1);

  const show = useCallback((message: string, options?: ToastOptions) => {
    const duration = Math.max(1200, Math.min(6000, options?.durationMs ?? 2000));
    const id = idRef.current++;
    const until = Date.now() + duration;
    setItems((prev) => [...prev, { id, msg: message, until }]);
  }, []);

  // Reap expired toasts
  useEffect(() => {
    if (items.length === 0) return;
    const t = window.setInterval(() => {
      const now = Date.now();
      setItems((prev) => prev.filter((it) => it.until > now));
    }, 250);
    return () => window.clearInterval(t);
  }, [items.length]);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="mxtk-toast-host" role="status">
        {items.map((it) => (
          <div key={it.id} className="mxtk-toast glass" role="alert">{it.msg}</div>
        ))}
      </div>
      <style jsx global>{`
        .mxtk-toast-host{
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 70;
          display: grid; place-items: center; pointer-events: none;
          padding: 0 12px; padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
        }
        @media (min-width: 641px){ .mxtk-toast-host{ bottom: 18px; } }
        .mxtk-toast{
          pointer-events: auto;
          margin: 6px 0;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 14px;
          color: var(--ink-strong);
          background: color-mix(in srgb, #ffffff 82%, transparent);
          border: 1px solid rgba(0,0,0,.08);
          box-shadow: 0 8px 20px rgba(0,0,0,.18);
        }
        html.dark .mxtk-toast{
          color: #E6EAF2;
          background: color-mix(in srgb, #11161e 72%, transparent);
          border: 1px solid rgba(255,255,255,.12);
        }
      `}</style>
    </ToastCtx.Provider>
  );
}


