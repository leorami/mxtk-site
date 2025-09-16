import { validateEvent } from "@/app/api/telemetry/journey/logic";

test("rejects invalid, accepts known events", () => {
  expect(()=>validateEvent({ t:"stage_change", from:"training", to:"preparing" })).not.toThrow();
  expect(()=>validateEvent({ t:"widget_pin", id:"price-large" })).not.toThrow();
  expect(()=>validateEvent({ t:"nope" as any })).toThrow();
});


