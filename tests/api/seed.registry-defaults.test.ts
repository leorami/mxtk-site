import { seedHome } from "@/app/api/ai/home/seed/logic";
import { registry } from "@/components/home/engine/registry";
import { type Stage } from "@/copy/home";

test("seed returns coverage and stage-fit widgets", async () => {
  const stages: Stage[] = ["training","preparing","conquer"];
  for (const s of stages) {
    const out = await seedHome({ id: null, stage: s, adapt: false, registry });
    const ids = out.widgets.map(w=>w.id);
    const cat = (id:string)=>registry.find(r=>r.id===id)!.categories || [];
    const has = (c:string)=>ids.some(id=>cat(id).includes(c));
    expect(has("Owners")).toBeTruthy();
    expect(has("Transparency")).toBeTruthy();
    expect(has("Resources")).toBeTruthy();
  }
});


