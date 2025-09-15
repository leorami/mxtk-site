import Card from './Card'

export default function IconCard({
  icon,
  title,
  children,
  faIcon,
  iconClassName = 'w-6 h-6',
  badges,
  bgClass = '',
  iconColorClass = 'text-emerald-600'
}: {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
  faIcon?: string
  iconClassName?: string
  badges?: Array<{ label: string; href?: string; faIcon?: string }>
  bgClass?: string
  iconColorClass?: string
}) {
  return (
    <Card className="text-center p-6 hover:shadow-glow transition-all duration-300" style={{ minWidth: 280, minHeight: 210 }}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.12)] ${bgClass}`}>
        <div className={iconColorClass}>
          {faIcon ? <i className={`fa-solid ${faIcon} text-2xl`} aria-hidden></i> : icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="text-muted text-sm">{children}</div>
      {Array.isArray(badges) && badges.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {badges.map((b, i) => (
            b.href ? (
              <a key={i} href={b.href} className="inline-flex items-center gap-1 text-xs rounded-lg border border-[var(--border-soft)] px-2 py-0.5 hover:bg-[var(--surface-elev-1)]">
                {b.faIcon ? <i className={`fa-solid ${b.faIcon}`} aria-hidden></i> : null}
                <span>{b.label}</span>
              </a>
            ) : (
              <span key={i} className="inline-flex items-center gap-1 text-xs rounded-lg border border-[var(--border-soft)] px-2 py-0.5">
                {b.faIcon ? <i className={`fa-solid ${b.faIcon}`} aria-hidden></i> : null}
                <span>{b.label}</span>
              </span>
            )
          ))}
        </div>
      )}
    </Card>
  )
}
