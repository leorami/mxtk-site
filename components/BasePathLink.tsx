"use client";
import Link, { LinkProps } from 'next/link';
import React from 'react';

type Props = Omit<LinkProps, 'href'> & {
  href?: LinkProps['href'];
  to?: string; // convenience prop used across pages
  className?: string;
  children: React.ReactNode;
};

export default function BasePathLink({ href, to, children, className, ...rest }: Props) {
  const raw = typeof href !== 'undefined' ? href : to;

  let target: LinkProps['href'];
  if (typeof raw === 'string') {
    target = raw.startsWith('/') ? raw : `/${raw}`;
  } else if (raw) {
    target = raw;
  } else {
    target = '/' as LinkProps['href'];
  }

  return (
    <Link href={target} className={className} {...rest}>
      {children}
    </Link>
  );
}


