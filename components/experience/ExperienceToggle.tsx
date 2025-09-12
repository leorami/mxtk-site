"use client";
import AppImage from "@/components/ui/AppImage";
import { useExperience } from "./ClientExperience";

const modes = [
  { value: "learn", label: "Learn", src: "/icons/experience/icon-learn.svg" },
  { value: "build", label: "Build", src: "/icons/experience/icon-build.svg" },
  { value: "operate", label: "Operate", src: "/icons/experience/icon-operate.svg" },
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
              "px-3 py-1.5 rounded-full text-sm transition flex items-center justify-center",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--mxtk-orange)_60%,transparent)]",
              selected
                ? "bg-[color-mix(in_srgb,var(--mxtk-orange)_30%,transparent)] dark:bg-[color-mix(in_srgb,var(--mxtk-orange)_34%,transparent)] shadow-sm"
                : "opacity-85 hover:opacity-100"
            ].join(" ")}
            title={m.label}
          >
            <span className="inline-flex items-center justify-center w-7 h-7">
              <AppImage
                src={m.src}
                alt=""
                width={20}
                height={20}
                className={[
                  "w-5 h-5",
                  selected ? "brightness-0 invert" : "",
                ].join(" ")}
              />
              <span className="sr-only">{m.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}


