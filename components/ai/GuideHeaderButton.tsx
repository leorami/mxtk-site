'use client'

import AppImage from '@/components/ui/AppImage'

export default function GuideHeaderButton() {
  return (
    <button
      data-testid="ai-button"
      aria-label="Open Sherpa"
      className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-lg border border-[var(--border-soft)] hover:bg-[var(--hover-bg)]"
      onClick={() => { try { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} })) } catch {} }}
    >
      <AppImage src="icons/ai/icon-sherpa.svg" alt="" width={16} height={16} className="w-4 h-4" />
      <span className="hidden md:inline">Sherpa</span>
    </button>
  )
}


