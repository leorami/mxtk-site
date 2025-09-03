import { cookies, headers } from "next/headers";
import ClientExperience from "./ClientExperience";

export type XMode = "learn" | "build" | "operate";

function parseMode(v?: string): XMode | null {
  if (!v) return null;
  const m = v.toLowerCase();
  if (m === "learn" || m === "build" || m === "operate") return m as XMode;
  // Back-compat from earlier prototype (explorer/pro/expert)
  if (m === "explorer") return "learn";
  if (m === "pro") return "build";
  if (m === "expert") return "operate";
  return null;
}

export default async function ExperienceProvider({ children }: { children: React.ReactNode }) {
  // Optional: if middleware sets x-current-url; otherwise we’ll just read cookies
  const h = await headers();
  const url = h.get("x-current-url") || "";
  const qp = url.includes("?") ? url.split("?")[1] : "";
  const qpMode = parseMode(qp ? new URLSearchParams(qp).get("x") || undefined : undefined);

  const c = await cookies();
  const ckMode = parseMode(c.get("mxtk.xmode")?.value);

  const initial: XMode = (qpMode || ckMode || "build"); // default to “Build”
  return <ClientExperience initial={initial}>{children}</ClientExperience>;
}


