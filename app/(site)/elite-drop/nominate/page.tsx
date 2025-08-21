'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

export default function NominatePage(){
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true)
    // placeholder: wire up to your API/email later
    await new Promise(r => setTimeout(r, 800))
    alert('Thanks! This is a preview form. We will contact you with next steps.')
    setBusy(false)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Nominate a Nonprofit (Preview)</h1>
      <p className="text-muted">
        Final terms will include lock period and learning commitments. For now, submit the basics below.
      </p>

      <Card embedded>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="field">
            <Label htmlFor="org">Organization name</Label>
            <Input id="org" name="org" placeholder="Full legal name" required />
          </div>

          <div className="field">
            <Label htmlFor="ein">EIN (or country equivalent)</Label>
            <Input id="ein" name="ein" placeholder="12-3456789" />
            <p className="hint">If outside the U.S., provide your registration number.</p>
          </div>

          <div className="field">
            <Label htmlFor="site">Website</Label>
            <Input id="site" name="site" placeholder="https://example.org" />
          </div>

          <div className="field">
            <Label htmlFor="contact">Contact person & role</Label>
            <Input id="contact" name="contact" placeholder="Jane Doe, Director of Development" required />
          </div>

          <div className="field">
            <Label htmlFor="summary">Program summary & expected outcomes</Label>
            <Textarea id="summary" name="summary" rows={5} placeholder="Tell us about the program and how you measure outcomes." required />
            <p className="hint">We look for clear, outcomes-driven initiatives.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? 'Submitting…' : 'Submit nomination'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => (document.querySelector('form') as HTMLFormElement)?.reset()}>
              Clear
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}