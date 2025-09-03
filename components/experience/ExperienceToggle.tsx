"use client";
import { useExperience } from "./ClientExperience";

const modes = [
  { value: "learn",   label: "Learn" },
  { value: "build",   label: "Build" },
  { value: "operate", label: "Operate" },
] as const;

export default function ExperienceToggle() {
  const { mode, setMode } = useExperience();
  return (
    <div
      className={[
        "flex items-center gap-1 rounded-full",
        "px-1 py-1",
        "glass",
        "bg-[var(--accent,#ffb84d)]/10",
        "border border-[var(--accent,#ffb84d)]/25",
        "shadow-sm"
      ].join(" ")}
      role="group"
      aria-label="Experience mode"
    >
      {modes.map((m) => {
        const selected = mode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            aria-pressed={selected}
            className={[
              "px-3 py-1 rounded-full text-sm transition",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--mxtk-orange)_60%,transparent)]",
              selected
                ? "bg-[color-mix(in_srgb,var(--mxtk-orange)_30%,transparent)] dark:bg-[color-mix(in_srgb,var(--mxtk-orange)_34%,transparent)] shadow-sm"
                : "opacity-85 hover:opacity-100"
            ].join(" ")}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}


