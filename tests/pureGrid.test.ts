import { GridCfg, resolveCollisions, WidgetState } from "@/lib/home/pureGrid"
import { describe, expect, it } from "vitest"

describe("resolveCollisions", () => {
    const cfg: GridCfg = { cols: 12, rowH: 24, gap: 12 }
    it("pushes overlapped items down", () => {
        const a: WidgetState = { id: "a", pos: { x: 0, y: 0 }, size: { w: 6, h: 2 } }
        const b: WidgetState = { id: "b", pos: { x: 0, y: 0 }, size: { w: 6, h: 2 } }
        const out = resolveCollisions([a, b], { ...a, pos: { x: 0, y: 0 } }, cfg)
        const aOut = out.find(w => w.id === "a")!, bOut = out.find(w => w.id === "b")!
        expect(aOut.pos.y === 0 || bOut.pos.y === 0).toBe(true)
        expect(aOut.pos.y !== bOut.pos.y).toBe(true)
    })
})


