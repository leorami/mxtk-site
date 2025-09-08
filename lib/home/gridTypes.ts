// Grid-oriented Home types for Adaptive Home (Wave 9.0)

export type HomeId = string;
export type WidgetId = string;

export const GRID_COLS = 12;
export const GRID_ROW_H = 24; // px per row, for layout math in UI layers

export type WidgetType =
  | 'getting-started'
  | 'recent-answers'
  | 'glossary-spotlight'
  | 'custom-note'
  | 'resource-list';

export interface Size {
  w: number; // grid columns
  h: number; // grid rows
}

export interface Pos {
  x: number; // grid column index (0-based)
  y: number; // grid row index (0-based)
}

export interface WidgetState {
  id: WidgetId;
  type: WidgetType;
  title?: string;
  size: Size;
  pos: Pos;
  pinned?: boolean;
  data?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface HomeDoc {
  id: HomeId;
  widgets: WidgetState[];
  layoutVersion: 1;
}


// Per-widget-type interaction metadata
export const widgetTypeMeta: Record<WidgetType, { minSize?: Size }> = {
  'getting-started': { minSize: { w: 3, h: 2 } },
  'recent-answers': { minSize: { w: 4, h: 3 } },
  'glossary-spotlight': { minSize: { w: 3, h: 2 } },
  'custom-note': { minSize: { w: 3, h: 2 } },
  'resource-list': { minSize: { w: 3, h: 2 } },
};

export function getMinSizeForWidget(type: WidgetType): Size | undefined {
  return widgetTypeMeta[type]?.minSize;
}


