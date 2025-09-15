# Widgets Grid

## Move & Resize
- Drag from header (`.wf-head`) with Sherpa open (`html.guide-open`)
- Resize using corner handles (`.wframe-resize`)
- Client optimistically updates local state, then PATCHes `/api/ai/home/:id`

## Mobile stacking
- One-column layout below 640px; Grid recomputes sequential rows and persists positions

## Persistence
- Debounced PATCH batches: `{ widgets: [{ id, pos }, { id, size }] }`
- Server-side validation clamps grid bounds

## Testing
- `tools/test/dashboard-drag.mjs` validates: visual change, server persistence, no mobile overlap
- Add `data-testid="wframe"` to widget frame container for targeting
