'use client'

import OrganizationLogo from './OrganizationLogo'

interface Organization {
  name: string
  logoPath: string
  alt?: string
  website?: string
}

interface OrganizationLogoGridProps {
  organizations: Organization[]
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  columns?: 2 | 3 | 4 | 5 | 6
  className?: string
}

export default function OrganizationLogoGrid({
  organizations,
  title,
  subtitle,
  size = 'md',
  columns = 4,
  className = ''
}: OrganizationLogoGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-3 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6'
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {(title || subtitle) && (
        <div className="text-center">
          {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
          {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
        </div>
      )}
      
      <div className={`grid ${gridCols[columns]} gap-6 items-center justify-items-center`}>
        {organizations.map((org, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {org.website ? (
              <a 
                href={org.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group transition-transform hover:scale-[1.02]"
              >
                <OrganizationLogo
                  name={org.name}
                  logoPath={org.logoPath}
                  alt={org.alt}
                  size={size}
                  className="group-hover:shadow-lg transition-shadow"
                />
              </a>
            ) : (
              <OrganizationLogo
                name={org.name}
                logoPath={org.logoPath}
                alt={org.alt}
                size={size}
              />
            )}
            <span className="text-xs text-muted text-center max-w-20 truncate">
              {org.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
