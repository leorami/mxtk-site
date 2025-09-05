"use client";

import { useEffect, useState } from 'react';

export default function FooterChatBar(){
  const [value, setValue] = useState('')

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const prompt = value.trim()
    if (!prompt) return
    try {
      window.dispatchEvent(new CustomEvent('mxtk:guide:open', { detail: { prompt, send: true } }))
    } catch {}
    setValue('')
  }

  return (
    <form onSubmit={submit} className="block w-full" aria-label="Ask Sherpa">
      <div className="flex items-center w-full" style={{ gap: '8px' }}>
        <input
          type="text"
          value={value}
          onChange={(e)=>setValue(e.target.value)}
          placeholder="Ask the Sherpa..."
          className="flex-1 px-3 text-sm text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[rgba(18,22,28,0.80)] dark:bg-[rgba(18,22,28,0.80)]"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center"
          disabled={!value.trim()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    </form>
  )
}

// Ensure drawer bottom avoids the footer chat bar height
export function FooterChatBarMountEffect(){
  useEffect
  return null as any
}


