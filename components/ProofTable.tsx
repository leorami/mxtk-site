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
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30'
    case 'NI43-101':
      return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/30'
    case 'SKR':
      return 'bg-navy-100 text-navy-800 border-navy-200 dark:bg-navy-900/20 dark:text-navy-300 dark:border-navy-800/30'
    case 'AUDIT':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30'
    case 'ATTESTATION':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30'
    case 'REPORT':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/30'
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