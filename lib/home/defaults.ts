// lib/home/defaults.ts
import { SectionKey, SectionState, Mode, WidgetState } from './types';

export function defaultSections(): SectionState[] {
  return (['overview','learn','build','operate','library'] as SectionKey[])
    .map((key, i) => ({
      id: `sec_${key}`,
      key,
      title: key === 'overview' ? 'Overview' : key[0].toUpperCase() + key.slice(1),
      order: i,
      collapsed: false,
    }));
}

/** Minimal, mode-aware starter widgets. Safe to re-seed. */
export function seedWidgets(mode: Mode): WidgetState[] {
  const base: WidgetState[] = [
    { id:'w_recent',  type:'recent-answers',     title:'Recent Answers',      sectionId:'sec_overview', size:{w:4,h:6}, pos:{x:0,y:0} },
    { id:'w_res',     type:'resources',          title:'Resources',           sectionId:'sec_overview', size:{w:4,h:6}, pos:{x:4,y:0} },
    { id:'w_gloss',   type:'glossary-spotlight', title:'Glossary Spotlight',  sectionId:'sec_overview', size:{w:4,h:6}, pos:{x:8,y:0} },
    { id:'w_note',    type:'note',               title:'Notes',               sectionId:'sec_learn',    size:{w:4,h:6}, pos:{x:0,y:0} },
    { id:'w_next',    type:'whats-next',         title:"What's Next",         sectionId:'sec_learn',    size:{w:4,h:6}, pos:{x:4,y:0} },
  ];
  // Light mode nudges to keep layout distinct but idempotent.
  if (mode === 'build')    base.find(w=>w.id==='w_next')!.sectionId = 'sec_build';
  if (mode === 'operate')  base.find(w=>w.id==='w_res')!.sectionId  = 'sec_operate';
  return base;
}