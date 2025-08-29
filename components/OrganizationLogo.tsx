'use client'

import AppImage from '@/components/ui/AppImage'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

interface OrganizationLogoProps {
  name: string
  logoPath: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function OrganizationLogo({ 
  name, 
  logoPath, 
  alt, 
  size = 'md',
  className = '' 
}: OrganizationLogoProps) {
  const [mounted, setMounted] = useState(false)
  const [imageError, setImageError] = useState(false)
  const pathname = usePathname() || '/'

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const fallbackInitials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (!mounted) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center bg-[var(--surface-card)] text-[var(--ink-muted)] ${className}`}>
        <div className="font-semibold text-sm">...</div>
      </div>
    )
  }

  if (imageError || !logoPath) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg flex items-center justify-center bg-[var(--surface-2)]` + ` ${className}`}>
        <span className="font-semibold text-sm" style={{color:'var(--ink-strong)'}}>{fallbackInitials}</span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <AppImage
        src={logoPath}
        alt={alt || `${name} logo`}
        fill
        className="object-contain rounded-lg"
        onError={() => setImageError(true)}
        sizes={size === 'sm' ? '32px' : size === 'md' ? '48px' : '64px'}
      />
    </div>
  )
}
