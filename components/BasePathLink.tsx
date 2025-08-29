'use client'

import { getRelativePath } from '@/lib/routing/basePath'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

type BasePathLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  to: string
}

export default function BasePathLink({ to, ...rest }: BasePathLinkProps) {
  const pathname = usePathname() || '/'
  const href = getRelativePath(to, pathname)
  return <Link {...rest} href={href} />
}


