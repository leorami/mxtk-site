"use client";
import Grid from '@/components/home/Grid';
import type { HomeDoc, WidgetState } from '@/lib/home/gridTypes';
import { useEffect, useMemo, useState } from 'react';

export default function HomeClient({ id, initialDoc }: { id?: string; initialDoc?: HomeDoc }) {
  const [widgets, setWidgets] = useState<WidgetState[]>(() => initialDoc?.widgets || []);
  useEffect(() => { if (initialDoc?.widgets) setWidgets(initialDoc.widgets); }, [initialDoc?.widgets]);
  const doc = useMemo<HomeDoc>(() => ({ id: id || 'guest', widgets, layoutVersion: 1 }), [id, widgets]);
  // On first visit, gently open Sherpa to encourage adding widgets and set cookie home id if missing
  useEffect(() => {
    try {
      const already = sessionStorage.getItem('mxtk.home.intro.shown');
      const hasWidgets = (initialDoc?.widgets || []).length > 0;
      if (!already && !hasWidgets) {
        sessionStorage.setItem('mxtk.home.intro.shown', '1');
        window.dispatchEvent(new CustomEvent('mxtk:guide:open'));
      }
    } catch { }
  }, [initialDoc?.widgets?.length]);
  return (
    <Grid doc={doc} onAction={() => { /* no-op for now */ }} />
  );
}


