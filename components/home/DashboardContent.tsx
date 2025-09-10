"use client";

import type { HomeDocV2 } from '@/lib/home/types';
import { useEffect, useMemo, useState } from 'react';
import Grid from './Grid';
import { useDebouncedCallback } from "use-debounce";

export default function DashboardContent({ initialDocId }: { initialDocId: string }) {
    const [doc, setDoc] = useState<HomeDocV2 | null>(null);
    
    // Move useMemo before any conditional returns to maintain hook order
    const sections = useMemo(
        () => doc ? [...doc.sections].sort((a, b) => a.order - b.order) : [],
        [doc]
    );

    useEffect(() => {
        (async () => {
            // GET auto-migrates v1 -> v2
            const res = await fetch(`/api/ai/home/${initialDocId}`, { cache: 'no-store' });
            const d = await res.json();
            setDoc(d);
            // Seed only if empty (idempotent)
            if (!d.widgets?.length) {
                await fetch(`/api/ai/home/seed?id=${initialDocId}`, { method: 'POST' });
                const again = await fetch(`/api/ai/home/${initialDocId}`, { cache: 'no-store' }).then(r => r.json());
                setDoc(again);
            }
        })();
    }, [initialDocId]);

    if (!doc) return null;

    return (
        <div className="space-y-12">
            {doc.sections.sort((a,b)=>a.order-b.order).map(sec => (
              <section key={sec.id} className="section-rail glass glass--panel p-4 md:p-6 rounded-xl mb-6">
                <header className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{sec.title}</h3>
                  <button className="text-xs opacity-70 hover:opacity-100">Collapse</button>
                </header>
                <Grid
                  doc={doc}
                  sectionId={sec.id}
                  onChange={useDebouncedCallback((widgets) => {
                    fetch(`/api/ai/home/${doc.id}`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ widgets }),
                    });
                  }, 600)}
                />
              </section>
            ))}
        </div>
    );
}