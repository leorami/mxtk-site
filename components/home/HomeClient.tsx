"use client";
import { useEffect, useMemo, useState } from 'react';
import type { HomeDoc, WidgetState } from '@/lib/home/gridTypes';
import Grid from '@/components/home/Grid';

export default function HomeClient({ id, initialDoc }: { id?: string; initialDoc?: HomeDoc }){
  const [widgets, setWidgets] = useState<WidgetState[]>(() => initialDoc?.widgets || []);
  useEffect(() => { if (initialDoc?.widgets) setWidgets(initialDoc.widgets); }, [initialDoc?.widgets]);
  const doc = useMemo<HomeDoc>(() => ({ id: id || 'guest', widgets, layoutVersion: 1 }), [id, widgets]);
  return (
    <Grid doc={doc} onAction={() => { /* no-op for now */ }} />
  );
}


