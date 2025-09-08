import Card from '@/components/ui/Card'

type Row = {
  month: string
  trades: number
  notionalUsd: string
  notes?: string
}

export default function OtcAggregates({
  rows
}: {
  rows: Row[]
}) {
  return (
    <Card interactive>
      <div className='text-sm font-semibold'>OTC monthly aggregates (anonymized)</div>

      {/* Mobile card layout */}
      <div className='mt-2 space-y-3 md:hidden'>
        {rows.map((r, i) => (
          <div key={i} className="rounded-lg border border-[var(--border-soft)] p-3 bg-[var(--surface-card-emb)]">
            <div className="font-medium text-[var(--ink-strong)] mb-2">{r.month}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Trades</div>
                <div className="text-[var(--ink-strong)]">{r.trades}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Notional (USD)</div>
                <div className="text-[var(--ink-strong)]">{r.notionalUsd}</div>
              </div>
            </div>
            {r.notes && (
              <div className="mt-2 pt-2 border-t border-[var(--border-soft)]">
                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Notes</div>
                <div className="text-[var(--ink-muted)] text-sm">{r.notes}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className='mt-2 overflow-x-auto hidden md:block'>
        <table className='table text-sm md:table-fixed'>
          <thead>
            <tr>
              <th>Month</th>
              <th>Trades</th>
              <th>Notional (USD)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className='align-top'>
                <td>{r.month}</td>
                <td>{r.trades}</td>
                <td>{r.notionalUsd}</td>
                <td className='text-muted'>{r.notes ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className='mt-2 text-xs text-muted'>Aggregates exclude personally identifiable info and counterparties.</p>
    </Card>
  )
}