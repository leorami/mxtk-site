import { z } from "zod";

export const EventSchema = z.discriminatedUnion("t", [
  // Accept both legacy and current stage names to avoid 500s from clients
  z.object({ t:z.literal("stage_change"), from:z.enum(["training","preparing","conquer","learn","build","operate"]), to:z.enum(["training","preparing","conquer","learn","build","operate"]) }),
  z.object({ t:z.enum(["widget_open","widget_pin"]), id:z.string().min(1) }),
  z.object({ t:z.literal("dwell"), id:z.string().min(1), ms:z.number().min(0) }),
  z.object({ t:z.literal("sherpa_prompt"), q:z.string().min(1), topic:z.string().optional() }),
  z.object({ t:z.literal("answer_click"), target:z.string().min(1) }),
  z.object({ t:z.literal("pageview"), path:z.string().min(1), ref:z.string().optional() }),
]);
export type JourneyEvent = z.infer<typeof EventSchema>;
export function validateEvent(e:any){ return EventSchema.parse(e); }
export async function storeEvent(_homeId:string|null, _e:JourneyEvent){ /* persist or enqueue */ }


