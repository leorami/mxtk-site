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
      <div className='overflow-x-auto'>
        <table className='table text-sm'>
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
              <tr key={p.id}>
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
                <td className='font-mono text-xs'>{p.sha256.slice(0, 12)}…</td>
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