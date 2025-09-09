"use client";

import Grid from '@/components/home/Grid';
import Section from '@/components/home/Section';
import WidgetFrame from '@/components/home/WidgetFrame';
import { getApiPath } from '@/lib/basepath';
import { HomeDocV2, SectionState, WidgetState } from '@/lib/home/types';
import { useEffect, useState } from 'react';

export default function DashboardContent({
    initialDocId = 'default'
}: {
    initialDocId?: string
}) {
    const [doc, setDoc] = useState<HomeDocV2>({
        id: initialDocId,
        layoutVersion: 2,
        sections: [],
        widgets: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchHomeDoc() {
            try {
                setLoading(true);
                // Use the full URL with origin to avoid URL parsing errors
                const origin = window.location.origin;
                const path = getApiPath(`/api/ai/home/${initialDocId}`);
                const url = new URL(path, origin).toString();

                const res = await fetch(url, {
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
                }

                const data = await res.json();
                setDoc(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching home doc:', err);
                setError('Failed to load dashboard content. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        fetchHomeDoc();
    }, [initialDocId]);

    if (loading) {
        return <div className="text-center py-10">Loading your dashboard...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 mt-6">
            {doc.sections
                .sort((a, b) => a.order - b.order)
                .map((sec: SectionState) => {
                    const sectionWidgets = doc.widgets.filter(w => w.sectionId === sec.id);
                    return (
                        <Section key={sec.id} title={sec.title} collapsed={sec.collapsed}>
                            <div className="glass glass--panel p-4 md:p-6 rounded-xl">
                                {sectionWidgets.length > 0 ? (
                                    <Grid
                                        doc={{ id: doc.id, widgets: sectionWidgets }}
                                        onChange={() => {/* debounced PATCH already occurs inside Grid */ }}
                                    >
                                        {(widget: WidgetState) => (
                                            <WidgetFrame
                                                widget={widget}
                                                onAction={(action, w) => {
                                                    if (action === 'remove') {
                                                        // Handle widget removal
                                                        const updatedWidgets = doc.widgets.filter(widget => widget.id !== w.id);
                                                        setDoc({ ...doc, widgets: updatedWidgets });

                                                        // Persist to backend
                                                        const origin = window.location.origin;
                                                        const path = getApiPath(`/api/ai/home/${doc.id}`);
                                                        const url = new URL(path, origin).toString();

                                                        fetch(url, {
                                                            method: 'PATCH',
                                                            headers: { 'content-type': 'application/json' },
                                                            body: JSON.stringify({ widgets: updatedWidgets }),
                                                        }).catch(err => console.error('Failed to update widgets:', err));
                                                    }
                                                }}
                                            />
                                        )}
                                    </Grid>
                                ) : (
                                    <div className="text-center py-6 text-muted">
                                        No widgets in this section yet.
                                        <div className="mt-2">
                                            <button
                                                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 rounded-md"
                                                onClick={() => {
                                                    // Seed this section
                                                    const origin = window.location.origin;
                                                    const path = getApiPath(`/api/ai/home/seed?id=${doc.id}`);
                                                    const url = new URL(path, origin).toString();

                                                    fetch(url, {
                                                        method: 'POST',
                                                    }).then(() => window.location.reload());
                                                }}
                                            >
                                                Add starter widgets
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    );
                })}
        </div>
    );
}