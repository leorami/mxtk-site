import ClientExperience from "./ClientExperience";

export type XMode = "learn" | "build" | "operate" | "ai";

export default function ExperienceProvider({ children }: { children: React.ReactNode }) {
  // Default to "build" mode - the client will handle mode detection
  const initial: XMode = "build";
  return <ClientExperience initial={initial}>{children}</ClientExperience>;
}


