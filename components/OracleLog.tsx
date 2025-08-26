import Card from './ui/Card'

type Entry = {
  version: string
  effectiveAt: string
  summary: string
  cid?: string
}

// Color mapping for different oracle versions
const getVersionColor = (version: string) => {
  if (version.includes('Preview') || version.includes('preview')) {
    return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30'
  }
  if (version.includes('v0.1') || version.includes('v0.2')) {
    return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
  }
  if (version.includes('v1.0') || version.includes('v1.')) {
    return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30'
  }
  return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/30'
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
            <div className='flex items-center gap-2 mb-1'>
              <span className={`rounded-lg border px-2 py-0.5 text-xs font-medium ${getVersionColor(e.version)}`}>
                Oracle {e.version}
              </span>
            </div>
            <div className='text-sm'>{e.summary}</div>
            {e.cid && (
              <a 
                className='text-sm table-link' 
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