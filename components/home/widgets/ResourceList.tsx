
export default function ResourceList() {
    // Curate a few links based on copy highlights
    const links: Array<{ label: string; href: string }> = [
        { label: 'Resources', href: '/resources' },
        { label: 'Whitepaper', href: '/whitepaper' },
        { label: 'Transparency', href: '/transparency' },
    ];

    return (
        <div className="text-sm leading-relaxed">
            <ul className="space-y-2">
                {links.map((l) => (
                    <li key={l.href}>
                        <a className="underline" href={l.href}>{l.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}


