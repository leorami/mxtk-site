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


