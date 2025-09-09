import LogoGlyph from "./LogoGlyph";

// Professional fallback content for MXTK
const professionalSnippets = [
  "Transparent processes ensure accountability and trust.",
  "Compliance-first approach to regulatory requirements.",
  "Independent verification provides additional security.",
  "Real-time monitoring and reporting capabilities.",
  "Institutional-grade custody and settlement.",
  "Comprehensive audit trails for all transactions.",
  "Multi-signature governance with timelock controls.",
  "Professional-grade documentation and reporting.",
  "Secure infrastructure with redundant safeguards.",
  "Regular third-party security assessments.",
  "Clear communication and stakeholder updates.",
  "Industry-standard compliance and best practices.",
];

function getProfessionalFallback(index: number): string {
  return professionalSnippets[index % professionalSnippets.length];
}

export function BulletList({
  items,
  centered = false,
  showDescription = true,
}: {
  items: Array<{ title: string; body?: string }>;
  centered?: boolean;
  showDescription?: boolean;
}) {
  return (
    <div className={`space-y-4 ${centered ? 'text-center' : ''}`}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center">
            <LogoGlyph size={12} className="opacity-90" />
          </span>
          <div className={`flex-1 ${centered ? 'text-center' : 'text-left'}`}>
            <div className="font-semibold text-base" style={{ color: "var(--ink-strong)" }}>
              {item.title}
            </div>
            {showDescription && (
              <div className="text-sm text-muted mt-1 leading-relaxed">
                {item.body || getProfessionalFallback(i)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}