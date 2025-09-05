'use client'


export default function GuideHeaderButton() {
  return (
    <button
      data-testid="ai-button"
      aria-label="Open Sherpa"
      className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded-lg border border-[var(--border-soft)] hover:bg-[var(--hover-bg)]"
      onClick={() => { try { window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: {} })) } catch {} }}
    >
      🤖 <span className="hidden md:inline">Sherpa</span>
    </button>
  )
}


