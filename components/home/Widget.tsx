import * as React from 'react'

export default function Widget({ title, children, showHeader = false }: { title?: string; children?: React.ReactNode; showHeader?: boolean }){
  return (
    <div className="rounded-2xl border border-white/10 bg-[color-mix(in_oKLCH,canvas,transparent_30%)] backdrop-blur-md shadow">
      {showHeader ? <div className="p-3 text-sm font-semibold">{title}</div> : null}
      <div className="p-4">{children}</div>
    </div>
  )
}


