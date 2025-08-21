import Card from '@/components/ui/Card'
import Link from 'next/link'

export default function Ecosystem(){
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-semibold">MXTK Ecosystem</h1>
      <p className="text-[15px] text-muted">The ecosystem highlights tools and integrations that make MXTK useful—indexers, wallets, data feeds, custody, OTC rails, and developer resources.</p>

      <section className="section section-teal glass-embedded">
        <div className="grid gap-4 md:grid-cols-3">
          <Card embedded><div className="text-sm font-semibold">On-chain</div><ul className="mt-2 text-[13px] leading-6"><li>Token: Arbitrum — <span className="font-mono">0x3e4F…d9Ba</span></li><li>Uniswap v3 pool(s): auto-discovered</li><li>Planned: LP lock & timelock multisig</li></ul></Card>
          <Card embedded><div className="text-sm font-semibold">Data & indexers</div><p className="mt-1 text-[13px] text-muted">Factory + indexer discovery; subgraph metrics (TVL/volume) when available.</p></Card>
          <Card embedded><div className="text-sm font-semibold">Integrations (preview)</div><ul className="mt-2 text-[13px] leading-6"><li>Wallets & portfolio trackers</li><li>Custody/escrow for OTC</li><li>Analytics & risk tools</li></ul></Card>
        </div>
      </section>

      <section className="glass p-6 rounded-2xl">
        <div className="text-sm font-semibold">For developers</div>
        <ul className="mt-2 text-[13px] leading-6">
          <li>Addresses & ABI snippets via <Link href="/resources" className="underline">Resources</Link></li>
          <li>Pool discovery API: <code className="font-mono">/api/pools?auto=1</code></li>
        </ul>
      </section>
    </div>
  )
}
