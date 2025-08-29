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
    return 'bg-[color-mix(in_srgb,var(--mxtk-orange)_18%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-orange)_28%,transparent)]'
  }
  if (version.includes('v0.1') || version.includes('v0.2')) {
    return 'bg-[color-mix(in_srgb,var(--mxtk-navy)_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-navy)_24%,transparent)]'
  }
  if (version.includes('v1.0') || version.includes('v1.')) {
    return 'bg-[color-mix(in_srgb,var(--mxtk-teal)_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,var(--mxtk-teal)_24%,transparent)]'
  }
  return 'bg-[var(--surface-2)] text-[var(--ink-strong)] border-[var(--border-soft)]'
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