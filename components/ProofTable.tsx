import Card from './ui/Card'

type Proof = {
  id: string
  title: string
  type: string
  issuer: string
  effectiveDate: string
  cid: string
  sha256: string
}

// Color mapping for different proof types
const getTypeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'JORC':
      return 'bg-[color-mix(in_srgb,var(--mxtk-orange)_16%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-orange)_26%,transparent)]'
    case 'NI43-101':
      return 'bg-[color-mix(in_srgb,var(--mxtk-teal)_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-teal)_24%,transparent)]'
    case 'SKR':
      return 'bg-[color-mix(in_srgb,var(--mxtk-navy)_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-navy)_24%,transparent)]'
    case 'AUDIT':
      return 'bg-[color-mix(in_srgb,#22c55e_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#22c55e_24%,transparent)]'
    case 'ATTESTATION':
      return 'bg-[color-mix(in_srgb,#8b5cf6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#8b5cf6_24%,transparent)]'
    case 'REPORT':
      return 'bg-[color-mix(in_srgb,#3b82f6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#3b82f6_24%,transparent)]'
    default:
      return 'bg-[var(--surface-2)] text-[var(--ink-strong)] border-[var(--border-soft)]'
  }
}

export default function ProofTable({
  proofs
}: {
  proofs: Proof[]
}) {
  return (
    <Card tint="navy" embedded>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">Attestations & Audits</div>
      </div>

      {/* Mobile card layout */}
      <div className='mt-2 space-y-3 md:hidden'>
        {proofs.map(p => (
          <div key={p.id} className="rounded-lg border border-[var(--border-soft)] p-3 bg-[var(--surface-card-emb)]">
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium text-[var(--ink-strong)] flex-1">{p.title}</div>
              <span className={`rounded-xl border px-2 py-0.5 text-xs font-medium ml-2 ${getTypeColor(p.type)}`}>
                {p.type}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Issuer</div>
                <div className="text-[var(--ink-strong)]">{p.issuer}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">Effective Date</div>
                <div className="text-[var(--ink-strong)]">{p.effectiveDate}</div>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[var(--border-soft)]">
                <div>
                  <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">IPFS CID</div>
                  <a
                    className='text-blue-600 dark:text-blue-400 hover:underline text-sm break-all'
                    href={`https://ipfs.io/ipfs/${p.cid}`}
                    target='_blank'
                    rel="noopener noreferrer"
                  >
                    {p.cid}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-medium text-[var(--ink-muted)] uppercase tracking-wide">SHA256</div>
                  <div className="font-mono text-xs text-[var(--ink-strong)] break-all">{p.sha256}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className='overflow-x-auto hidden md:block'>
        <table className='table text-sm md:table-fixed'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Issuer</th>
              <th>Effective</th>
              <th>IPFS CID</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {proofs.map(p => (
              <tr key={p.id} className="align-top">
                <td>{p.title}</td>
                <td>
                  <span className={`rounded-xl border px-2 py-0.5 text-xs font-medium ${getTypeColor(p.type)}`}>
                    {p.type}
                  </span>
                </td>
                <td>{p.issuer}</td>
                <td>{p.effectiveDate}</td>
                <td>
                  <a
                    className='table-link'
                    href={`https://ipfs.io/ipfs/${p.cid}`}
                    target='_blank'
                    rel="noopener noreferrer"
                  >
                    {p.cid.slice(0, 12)}…
                  </a>
                </td>
                <td className='font-mono text-xs'>
                  {p.sha256.slice(0, 12)}…
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 text-xs text-muted">
        <strong>Type</strong> indicates the document category: <em>audit</em> (financial/technical review), <em>attestation</em> (legal/regulatory), or <em>report</em> (operational/status).
      </div>
    </Card>
  )
}