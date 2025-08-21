'use client'

import { useEffect, useState } from 'react'
import Button from './ui/Button'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className='fixed bottom-4 left-1/2 z-50 w-[95%] max-w-3xl -translate-x-1/2 glass p-4 shadow-lift'>
      <p className='text-sm text-muted'>We use privacy-friendly analytics. No tracking until you consent.</p>
      <div className='mt-3 flex gap-3'>
        <Button 
          onClick={() => {
            localStorage.setItem('cookie-consent', 'accepted')
            setVisible(false)
          }}
        >
          Accept
        </Button>
        <button 
          className='text-sm underline hover:text-brand-orange transition-colors' 
          onClick={() => {
            localStorage.setItem('cookie-consent', 'declined')
            setVisible(false)
          }}
        >
          Decline
        </button>
      </div>
    </div>
  )
}