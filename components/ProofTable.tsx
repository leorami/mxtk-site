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
                  <span className="rounded-xl border px-2 py-0.5 text-xs">
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