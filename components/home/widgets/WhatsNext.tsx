"use client";

export default function WhatsNext() {
  const suggestions = [
    {
      title: "Explore the whitepaper",
      description: "Learn about the technical foundations of MXTK",
      link: "/whitepaper"
    },
    {
      title: "Understand transparency",
      description: "See how MXTK ensures trust through transparent operations",
      link: "/transparency"
    },
    {
      title: "Browse resources",
      description: "Access guides, tutorials, and reference materials",
      link: "/resources"
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm mb-2">Suggested next steps for your journey:</p>
      <ul className="space-y-2">
        {suggestions.map((item, i) => (
          <li key={i} className="border border-[var(--border-soft)] rounded-lg p-2 hover:bg-[var(--surface-elev-1)] transition-colors">
            <a href={item.link} className="block">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-xs opacity-80">{item.description}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
