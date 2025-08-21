import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function Resources(){
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-semibold">Resources</h1>
      <p className="text-[15px] text-muted">Guides, brand assets, downloads, and technical references for owners, institutions, and developers.</p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card embedded tint="navy"><div className="text-sm font-semibold">Brand kit</div><p className="mt-1 text-[13px] text-muted">Logos, colors, and usage guidelines.</p><Link className="btn-link" href="/media">Open media kit</Link></Card>
        <Card embedded tint="amber"><div className="text-sm font-semibold">Owner guide</div><p className="mt-1 text-[13px] text-muted">Intake requirements, confidentiality, and proofs.</p><Link className="btn-link" href="/owners">View</Link></Card>
        <Card embedded tint="teal"><div className="text-sm font-semibold">Developers</div><p className="mt-1 text-[13px] text-muted">Addresses, ABIs, pool discovery API.</p><span className="text-[12px] text-muted">/api/pools?auto=1</span></Card>
      </div>
    </div>
  )
}
