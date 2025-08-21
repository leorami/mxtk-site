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
    <Card interactive>
      <div className='overflow-x-auto'>
        <table className='table'>
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
                <td>{p.type}</td>
                <td>{p.issuer}</td>
                <td>{p.effectiveDate}</td>
                <td>
                  <a 
                    className='underline hover:text-brand-orange transition-colors' 
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
    </Card>
  )
}