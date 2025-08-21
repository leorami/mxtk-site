'use client'

import NextLink from 'next/link'
import { withBase } from '@/lib/routing/basePath'
import { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof NextLink>

export default function Link({ href, ...props }: LinkProps) {
  // If href is a string, apply base path
  if (typeof href === 'string') {
    return <NextLink href={withBase(href)} {...props} />
  }
  
  // If href is an object, apply base path to the pathname
  if (typeof href === 'object' && href.pathname) {
    return <NextLink href={{ ...href, pathname: withBase(href.pathname) }} {...props} />
  }
  
  // Otherwise, pass through as-is
  return <NextLink href={href} {...props} />
}
