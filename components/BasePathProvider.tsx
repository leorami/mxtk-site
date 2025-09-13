"use client";
import { BasePathContext } from '@/lib/basepathContext';

export default function BasePathProvider({ value, children }:{ value: string; children: React.ReactNode }) {
  return (
    <BasePathContext.Provider value={value}>
      {children}
    </BasePathContext.Provider>
  );
}


