'use client';
import React, { createContext, useContext } from 'react';

const BasePathCtx = createContext<string>('');

export function useBasePath() { return useContext(BasePathCtx); }

export default function BasePathProvider({ value, children }: { value: string; children: React.ReactNode }) {
  return <BasePathCtx.Provider value={value}>{children}</BasePathCtx.Provider>;
}


