import LogoGlyph from "./LogoGlyph";

// Random Lorem ipsum generators
const loremSnippets = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  "Duis aute irure dolor in reprehenderit in voluptate velit.",
  "Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim.",
  "At vero eos et accusamus et iusto odio dignissimos.",
  "Et harum quidem rerum facilis est et expedita.",
  "Nam libero tempore, cum soluta nobis est eligendi.",
  "Temporibus autem quibusdam et aut officiis debitis.",
  "Neque porro quisquam est, qui dolorem ipsum.",
  "Ut enim ad minima veniam, quis nostrum exercitationem.",
];

function getRandomLorem(index: number): string {
  const snippet = loremSnippets[index % loremSnippets.length];
  // Randomly truncate to make varying lengths
  const truncateAt = Math.floor(snippet.length * (0.4 + (index * 0.1) % 0.6));
  return snippet.substring(0, truncateAt) + (truncateAt < snippet.length ? '...' : '');
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
                {item.body || getRandomLorem(i)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}