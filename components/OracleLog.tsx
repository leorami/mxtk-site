import Card from './ui/Card'

type Entry = {
  version: string
  effectiveAt: string
  summary: string
  cid?: string
}

export default function OracleLog({
  entries
}: {
  entries: Entry[]
}) {
  return (
    <Card interactive>
      <ol className='space-y-4'>
        {entries.map((e, i) => (
          <li key={i} className='border-l-2 border-brand-border pl-3'>
            <div className='text-sm text-muted'>{e.effectiveAt}</div>
            <div className='font-semibold'>Oracle {e.version}</div>
            <div className='text-sm'>{e.summary}</div>
            {e.cid && (
              <a 
                className='text-sm underline hover:text-brand-orange transition-colors' 
                href={`https://ipfs.io/ipfs/${e.cid}`} 
                target='_blank'
                rel="noopener noreferrer"
              >
                Methodology (PDF)
              </a>
            )}
          </li>
        ))}
      </ol>
    </Card>
  )
}