import LogoGlyph from "./LogoGlyph";

export function FeatureRow({
  items,
  cols = 3,
}: {
  items: Array<{ title: string; body?: string }>;
  cols?: 2 | 3 | 4;
}) {
  return (
    <div
      className={`grid gap-4 md:gap-5 ${cols === 4 ? "md:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
    >
      {items.map((it, i) => (
        <div
          key={i}
          className="group glass p-4 md:p-5 transition-transform duration-300 will-change-transform hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 rounded-full ring-1 ring-[var(--accent)]/35 bg-[var(--accent)]/18 shrink-0 items-center justify-center">
              <LogoGlyph size={12} className="opacity-90" />
            </span>
            <div>
              <div className="font-medium" style={{ color: "var(--ink-strong)" }}>
                {it.title}
              </div>
              {it.body ? (
                <div className="text-sm mt-0.5" style={{ color: "var(--ink)" }}>
                  {it.body}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
