## Wave 12.0 — Adaptive Home evolution

Highlights:
- Live widgets: Recent Answers (journey), Glossary Spotlight (session pick), Resource List (curated), Custom Note (editable with debounce save)
- Grid interactions: keyboard move (arrows) and resize (Shift+arrows), pointer drag/resize handles
- Persistence: PATCH /api/ai/home/[id] applies partial updates with validation; ETag returned
- Safety: SSR-safe (no window in render paths), no basePath/proxy changes, clamped grid and collision resolution

Interaction patterns:
- Move: Arrow keys move focused widget by 1 col/row. Pointer drag via top-left handle.
- Resize: Shift+Arrow resizes by 1; pointer resize via bottom-right handle.
- Pin/Remove: Toolbar buttons on each widget frame.

PATCH API:
- Endpoint: `/api/ai/home/[id]` (PATCH)
- Body: `{ widgetId, pos?, size?, pin?, remove?, data? }`
- Validated with Zod for `pos` and `size`; atomic apply via reducers and saved with atomic file rename.

Persistence flow:
- Client updates local state immediately, then debounced save to PATCH
- Server returns updated doc with weak ETag; clients may ignore for now

A11y controls:
- Focus a widget container to use keyboard move/resize
- Buttons have aria-labels and `data-testid` for tests

Demo script:
1. Ask Sherpa a question to create journey blocks
2. Go to Home: add “Recent Answers” and “Resource List” (or use existing)
3. Drag a widget, resize it, pin it, then remove it
4. Add a Custom Note; reload page; note persists


