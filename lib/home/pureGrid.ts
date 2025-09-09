export type XY = { x: number; y: number }
export type Size = { w: number; h: number }
export type Rect = XY & Size

export interface WidgetState {
    id: string
    pos: XY
    size: Size
    sectionId?: string
    // carry any extra fields without the pure funcs caring
    [k: string]: any
}

export interface GridCfg {
    cols: number          // e.g., 12
    rowH: number          // px height of a row (for drag math only)
    gap: number           // px gap between items (for math)
    maxRows?: number      // safety clamp
}

export function snapToGrid(pxX: number, pxY: number, cellW: number, rowH: number): XY {
    return { x: Math.max(0, Math.round(pxX / cellW)), y: Math.max(0, Math.round(pxY / rowH)) }
}

export function clampToGrid(pos: XY, size: Size, cfg: GridCfg): XY {
    const maxX = Math.max(0, cfg.cols - size.w)
    const clampedX = Math.min(Math.max(0, pos.x), maxX)
    const maxY = cfg.maxRows ? Math.max(0, cfg.maxRows - size.h) : Math.max(0, pos.y)
    const clampedY = Math.min(Math.max(0, pos.y), maxY)
    return { x: clampedX, y: clampedY }
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
    return !(a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y)
}

export function nextNonOverlappingPos(
    widgets: WidgetState[],
    movingId: string,
    cfg: GridCfg
): XY {
    const me = widgets.find(w => w.id === movingId)
    if (!me) return { x: 0, y: 0 }
    // Greedy push-down: if I overlap others, push me down until I don’t.
    let test = { ...me.pos }
    const tries = cfg.maxRows ? cfg.maxRows * 2 : 500
    for (let i = 0; i < tries; i++) {
        const overlap = widgets.some(w => w.id !== me.id && rectsOverlap({ ...w.pos, ...w.size }, { ...test, ...me.size }))
        if (!overlap) return test
        test = { x: test.x, y: test.y + 1 }
    }
    return clampToGrid(test, me.size, cfg)
}

export function resolveCollisions(
    widgets: WidgetState[],
    changed: WidgetState,
    cfg: GridCfg
): WidgetState[] {
    // Keep a working copy
    const items = widgets.map(w => ({ ...w }))
    const meIdx = items.findIndex(w => w.id === changed.id)
    if (meIdx === -1) return items
    items[meIdx] = { ...changed }

    // Push any overlapping *others* down greedily.
    let moved = true
    let guard = 0
    while (moved && guard < 2000) {
        guard++
        moved = false
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < items.length; j++) {
                if (i === j) continue
                const A = items[i], B = items[j]
                if (rectsOverlap({ ...A.pos, ...A.size }, { ...B.pos, ...B.size })) {
                    // Push the one that is NOT `changed` downward (stable)
                    const pushIdx = items[j].id === changed.id ? i : j
                    items[pushIdx] = {
                        ...items[pushIdx],
                        pos: clampToGrid({ x: items[pushIdx].pos.x, y: items[pushIdx].pos.y + 1 }, items[pushIdx].size, cfg)
                    }
                    moved = true
                }
            }
        }
    }
    return items
}


