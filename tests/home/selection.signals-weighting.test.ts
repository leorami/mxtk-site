import { selectWidgets } from "@/components/home/engine/selectWidgets";
import { mockRegistry } from "./helpers/mockRegistry";

test("pins and dwell outrank base priority; ties deterministic", () => {
  const r = mockRegistry();
  const a = selectWidgets({
    stage: "training",
    signals: { pins: ["price-large"], recency: {}, dwell: { "top-pools": 0.9 }, prompts: {} } as any,
    registry: r,
    max: 8
  });
  const order = a.map(x=>x.id).join(",");
  const b = selectWidgets({
    stage: "training",
    signals: { pins: ["price-large"], recency: {}, dwell: { "top-pools": 0.9 }, prompts: {} } as any,
    registry: r,
    max: 8
  });
  expect(order).toEqual(b.map(x=>x.id).join(","));
  expect(order.indexOf("price-large")).toBeLessThan(order.indexOf("recent-answers"));
});


