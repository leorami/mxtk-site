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
      <div className='mt-2 overflow-x-auto'>
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
                <td>
                  <div className="md:hidden text-[11px] uppercase tracking-wide text-muted mb-1">Month</div>
                  {r.month}
                </td>
                <td>
                  <div className="md:hidden text-[11px] uppercase tracking-wide text-muted mb-1">Trades</div>
                  {r.trades}
                </td>
                <td>
                  <div className="md:hidden text-[11px] uppercase tracking-wide text-muted mb-1">Notional (USD)</div>
                  {r.notionalUsd}
                </td>
                <td className='text-muted'>
                  <div className="md:hidden text-[11px] uppercase tracking-wide text-muted mb-1">Notes</div>
                  {r.notes ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className='mt-2 text-xs text-muted'>Aggregates exclude personally identifiable info and counterparties.</p>
    </Card>
  )
}