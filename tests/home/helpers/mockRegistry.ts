import type { WidgetMeta } from "@/components/home/engine/selectWidgets";

export function mockRegistry(): WidgetMeta[] {
  const items: Array<Partial<WidgetMeta> & { id: string }> = [
    { id: 'price-large', stages: ['preparing'], priority: 0.6, mobileFriendly: true, categories: ['Owners'] },
    { id: 'recent-answers', stages: ['training','preparing'], priority: 0.5, mobileFriendly: true, categories: ['Resources'] },
    { id: 'top-pools', stages: ['training'], priority: 0.4, mobileFriendly: true, categories: ['Transparency'] },
    { id: 'resources', stages: ['training','conquer'], priority: 0.3, mobileFriendly: true, categories: ['Resources'] },
  ];
  return items as WidgetMeta[];
}


