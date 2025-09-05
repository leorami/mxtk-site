import AppImage from '@/components/ui/AppImage';
import React from 'react';

export function KeyPointsGrid({ children }: React.PropsWithChildren) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {children}
    </div>
  )
}

export function KeyPoint({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-[--surface]/60 shadow-sm ring-1 ring-black/5 p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex h-6 w-6 rounded-full ring-1 ring-[var(--accent)]/30 bg-[var(--accent)]/12 items-center justify-center">
                  <AppImage
          src="icons/mxtk-micro.svg"
          width={14}
          height={14}
          alt=""
          className="opacity-80"
        />
        </span>
        <div className="font-semibold tracking-tight text-[--ink-strong]">
          {label}
        </div>
      </div>
      {children ? (
        <p className="text-sm leading-6 text-[--ink]">{children}</p>
      ) : null}
    </div>
  )
}


