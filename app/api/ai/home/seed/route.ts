import { toV2 } from '@/lib/home/migrate';
import { getHomeDoc, saveHomeDoc } from '@/lib/home/store/fileStore';
import type { HomeDocV2, SectionKey, WidgetType } from '@/lib/home/types';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type Mode = 'learn' | 'build' | 'operate';

// Updated presets with better sizes and section distribution
const PRESETS_V2 = {
  learn: [
    { key: "overview", type: "resources",  title: "Resources",           size:{w:4,h:10}, pos:{x:0,y:0} },
    { key: "overview", type: "glossary-spotlight",   title: "Glossary Spotlight",  size:{w:3,h:12}, pos:{x:4,y:0} },
    { key: "overview", type: "note",       title: "Notes",               size:{w:5,h:8},  pos:{x:7,y:0} },
    { key: "learn",    type: "whats-next", title: "What's Next",         size:{w:3,h:10}, pos:{x:0,y:0} },
    { key: "learn",    type: "recent-answers",     title: "Recent Answers",      size:{w:4,h:8},  pos:{x:3,y:0} },
  ],
  build: [
    { key: "overview", type: "recent-answers",     title: "Recent Answers",      size:{w:4,h:8},  pos:{x:0,y:0} },
    { key: "overview", type: "resources",  title: "API & SDK",           size:{w:4,h:10}, pos:{x:4,y:0} },
    { key: "build",    type: "whats-next", title: "What's Next",         size:{w:4,h:8},  pos:{x:8,y:0} },
  ],
  operate: [
    { key: "overview", type: "resources",  title: "Controls & Policy",   size:{w:5,h:10}, pos:{x:0,y:0} },
    { key: "overview", type: "recent-answers",     title: "Recent Answers",      size:{w:4,h:8},  pos:{x:5,y:0} },
    { key: "operate",  type: "whats-next", title: "What's Next",         size:{w:3,h:8},  pos:{x:9,y:0} },
  ],
} as const;

export async function POST(req: NextRequest) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });

    const cookieMode = (await cookies()).get('experience')?.value as Mode | undefined;
    const mode = (url.searchParams.get('mode') as Mode) || cookieMode || 'learn';
    const adapt = url.searchParams.get('adapt') === 'true';

    let doc = toV2(await getHomeDoc(id));

    // idempotent seed: if no widgets OR adapt=true, add missing preset widgets
    const secId = (key: SectionKey) =>
        doc.sections.find(s => s.key === key)!.id;

    const existingSig = new Set(doc.widgets.map(w => `${w.sectionId}:${w.type}`));

    const adds = PRESETS_V2[mode]
        .filter(p => adapt ? true : !existingSig.has(`${secId(p.key)}:${p.type}`))
        .map(p => ({
            id: randomUUID(),
            type: p.type as WidgetType,
            title: p.title,
            sectionId: secId(p.key),
            pos: { ...p.pos },
            size: { ...p.size },
            pinned: false,
            data: {},
        }));

    if (adds.length) {
        doc = { ...doc, widgets: [...doc.widgets, ...adds] };
        await saveHomeDoc(doc);
    }

    return NextResponse.json({ ok: true, added: adds.length, mode });
}