"use client";
import ThemeSwitch from "@/components/ThemeSwitch";
import ExperienceToggle from "@/components/experience/ExperienceToggle";
import { useEffect, useRef, useState } from "react";

export default function FooterDock() {
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef<number>(0);
  const tickingRef = useRef<boolean>(false);

  useEffect(() => {
    try { document.documentElement.classList.add('footer-dock-present') } catch {}
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        const last = lastYRef.current || 0;
        const delta = y - last;
        // Hide on scroll down, show on scroll up. Add small deadzone to avoid jitter
        if (Math.abs(delta) > 6) setHidden(delta > 0);
        lastYRef.current = y;
        tickingRef.current = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      try { document.documentElement.classList.remove('footer-dock-present') } catch {}
    };
  }, []);

  return (
    <div
      className={[
        'footer-dock',
        hidden ? 'footer-dock--hidden' : ''
      ].join(' ')}
      role="toolbar"
      aria-label="Mobile actions"
    >
      <div className="footer-dock__inner">
        <div className="footer-dock__left">
          <ExperienceToggle size="compact" />
        </div>
        <div className="footer-dock__right">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}


