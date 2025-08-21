export default function FAQ(){
  const items = [
    { q:'What backs MXTK?', a:'Evidence of mineral interests (e.g., JORC/NI 43-101/SKR) plus a documented oracle method. MXTK is not pegged to fiat; price governance is published and change-logged.' },
    { q:'Why Arbitrum?', a:'Low fees and predictable operations for frequent, auditable updates.' },
    { q:'Is OTC supported?', a:'Yes. Counterparties can transact via KYC/escrow providers (to be announced). The site publishes monthly aggregates without PII.' },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-semibold">FAQ</h1>
      <div className="space-y-3">
        {items.map((it, i) => (
          <details key={i} className="glass p-4 rounded-xl">
            <summary className="cursor-pointer text-sm font-semibold">{it.q}</summary>
            <p className="mt-2 text-[13px] text-muted">{it.a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
