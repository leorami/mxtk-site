"use client";
import { createContext, useContext, useEffect, useState } from "react";
import type { XMode } from "./ExperienceProvider";

const ExperienceCtx = createContext<{ mode: XMode; setMode: (m: XMode) => void; }>({
  mode: "build",
  setMode: () => {}
});

function parseMode(v?: string): XMode | null {
  if (!v) return null;
  const m = v.toLowerCase();
  if (m === "learn" || m === "build" || m === "operate" || m === "ai") return m as XMode;
  // Back-compat from earlier prototype (explorer/pro/expert)
  if (m === "explorer") return "learn";
  if (m === "pro") return "build";
  if (m === "expert") return "operate";
  return null;
}

export default function ClientExperience({ initial, children }:{ initial: XMode; children: React.ReactNode }) {
  const [mode, setMode] = useState<XMode>(initial);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Handle mode detection on client side - only run once
  useEffect(() => {
    if (hasInitialized) return; // Prevent running multiple times
    
    try {
      // Check URL parameters first - support both 'experience' and 'x' parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlMode = parseMode(urlParams.get("experience")) || parseMode(urlParams.get("x"));
      
      // Check cookies
      const cookies = document.cookie.split(';');
      let cookieMode: XMode | null = null;
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'mxtk.xmode') {
          cookieMode = parseMode(value);
          break;
        }
      }
      
      // Use URL mode, then cookie mode, then default
      const detectedMode = urlMode || cookieMode || initial;
      if (detectedMode !== mode) {
        setMode(detectedMode);
      }
      
      setHasInitialized(true);
    } catch (error) {
      // Fallback to initial mode if there's an error
      console.warn('Error detecting mode:', error);
      setHasInitialized(true);
    }
  }, [initial, hasInitialized, mode]); // Include mode dependency

  useEffect(() => { 
    document.documentElement.dataset.xmode = mode; 
  }, [mode]);
  
  useEffect(() => {
    try {
      document.cookie = `mxtk.xmode=${mode}; path=/; max-age=31536000; samesite=lax`;
    } catch (error) {
      console.warn('Error setting cookie:', error);
    }
  }, [mode]);

  return <ExperienceCtx.Provider value={{ mode, setMode }}>{children}</ExperienceCtx.Provider>;
}

export function useExperience() { 
  const context = useContext(ExperienceCtx);
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
}


