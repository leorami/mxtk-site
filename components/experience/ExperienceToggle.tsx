"use client";
import AppImage from "@/components/ui/AppImage";
import { useExperience } from "./ClientExperience";

const modes = [
  { value: "learn", label: "Training", src: "/icons/experience/icon-learn.svg" },
  { value: "build", label: "Preparing", src: "/icons/experience/icon-build.svg" },
  { value: "operate", label: "Conquer", src: "/icons/experience/icon-operate.svg" },
] as const;

type ExperienceToggleProps = {
  size?: 'default' | 'compact';
};

export default function ExperienceToggle({ size = 'default' }: ExperienceToggleProps) {
  const { mode, setMode } = useExperience();
  return (
    <div
      className={[
        "experience-toggle",
        "flex items-center gap-1 rounded-full",
        size === 'compact' ? 'px-0.5 py-0.5' : 'px-1 py-1',
        "glass",
        "bg-[var(--accent,#ffb84d)]/10",
        "border border-[var(--accent,#ffb84d)]/25",
        "shadow-sm"
      ].join(" ")}
      role="group"
      aria-label="Journey Stage"
    >
      {modes.map((m) => {
        const selected = mode === m.value;
        return (
          <button
            key={m.value}
            onClick={() => setMode(m.value)}
            aria-pressed={selected}
            aria-label={`Journey Stage: ${m.label}`}
            className={[
              (size === 'compact' ? 'px-2' : 'px-3'),
              "rounded-full text-sm transition flex items-center justify-center",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--mxtk-orange)_60%,transparent)]",
              selected
                ? "bg-[color-mix(in_srgb,var(--mxtk-orange)_80%,transparent)] dark:bg-[color-mix(in_srgb,var(--mxtk-orange)_80%,transparent)] shadow-sm"
                : "opacity-85 hover:opacity-100"
            ].join(" ")}
            title={`Journey Stage: ${m.label}`}
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


