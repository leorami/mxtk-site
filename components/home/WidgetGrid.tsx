"use client";
import type { HomeDoc, Widget } from '@/lib/home/types';
import { useState } from 'react';
import GlossaryCard from './widgets/GlossaryCard';
import ResourcesCard from './widgets/ResourcesCard';
import SummaryCard from './widgets/SummaryCard';

export default function WidgetGrid({ doc }: { doc: HomeDoc }){
  const [widgets, setWidgets] = useState<Widget[]>([...doc.widgets].sort((a,b)=>a.order-b.order));

  function render(w:Widget){
    const common = { key:w.id, id:w.id, title:w.title, data:w.data } as any;
    switch(w.type){
      case 'summary': return <SummaryCard {...common} />;
      case 'glossary': return <GlossaryCard {...common} />;
      case 'resources': return <ResourcesCard {...common} />;
      default: return <div key={w.id} className="rounded-2xl p-4 border bg-white/50">Unsupported widget: {w.type}</div>;
    }
  }

  function up(wid:string){ const i=widgets.findIndex(w=>w.id===wid); if(i<=0) return; const next=[...widgets]; [next[i-1],next[i]]=[next[i],next[i-1]]; setWidgets(next); }
  function down(wid:string){ const i=widgets.findIndex(w=>w.id===wid); if(i<0||i>=widgets.length-1) return; const next=[...widgets]; [next[i+1],next[i]]=[next[i],next[i+1]]; setWidgets(next); }
  function remove(wid:string){ setWidgets(widgets.filter(w=>w.id!==wid)); }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {widgets.map(w=> (
        <div key={w.id} className="group relative rounded-2xl border bg-glass/60 backdrop-blur">
          <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
            <button onClick={()=>up(w.id)} className="px-2 py-1 rounded bg-white/70 text-xs">↑</button>
            <button onClick={()=>down(w.id)} className="px-2 py-1 rounded bg-white/70 text-xs">↓</button>
            <button onClick={()=>remove(w.id)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">×</button>
          </div>
          {render(w)}
        </div>
      ))}
      {widgets.length===0 && (
        <div className="rounded-2xl border p-6 text-center text-sm opacity-70">Your Home is empty. Use the Sherpa or any “Add to Home” button across the site.</div>
      )}
    </div>
  );
}


