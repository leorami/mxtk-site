"use client";
import cn from 'classnames';
import React from 'react';

export default function FullBleed({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn('relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen', className)}>
      {children}
    </div>
  )
}


