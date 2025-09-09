// tests/pureStore.test.ts
import {
    clampToGrid,
    rectsOverlap,
    resolveCollisions,
    type Item,
} from "@/lib/home/pureStore";
import { describe, expect, it } from "vitest";

describe("pureStore helpers", () => {
    it("detects overlap", () => {
        expect(rectsOverlap({ x: 0, y: 0, w: 2, h: 2 }, { x: 1, y: 1, w: 2, h: 2 })).toBe(true);
        expect(rectsOverlap({ x: 0, y: 0, w: 1, h: 1 }, { x: 2, y: 2, w: 1, h: 1 })).toBe(false);
    });

    it("clamps to grid", () => {
        expect(clampToGrid({ x: -1, y: -1, w: 20, h: 1 }, 12)).toEqual({ x: 0, y: 0, w: 12, h: 1 });
    });

    it("pushes collisions down deterministically", () => {
        const items: Item[] = [
            { id: "a", pos: { x: 0, y: 0 }, size: { w: 3, h: 2 } },
            { id: "b", pos: { x: 1, y: 1 }, size: { w: 3, h: 2 } },
            { id: "c", pos: { x: 2, y: 1 }, size: { w: 3, h: 1 } },
        ];
        const out = resolveCollisions(items, 12);
        // "a" keeps position
        expect(out[0].pos.x).toEqual(0);
        expect(out[0].pos.y).toEqual(0);
        // "b" gets pushed below "a"
        expect(out[1].pos.y).toBeGreaterThanOrEqual(2);
    });
});
