export function Pillars({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className="glass p-5 bullet-float">
          <div className="ink-strong text-lg mb-1">{it.title}</div>
          <div className="text-sm">{it.body}</div>
        </div>
      ))}
    </div>
  );
}


