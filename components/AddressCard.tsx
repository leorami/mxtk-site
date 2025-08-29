import Card from './ui/Card'

// Color mapping for different chains
const getChainColor = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'arbitrum':
      return 'bg-[color-mix(in_srgb,#3b82f6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#3b82f6_24%,transparent)]'
    case 'ethereum':
      return 'bg-[color-mix(in_srgb,#8b5cf6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#8b5cf6_24%,transparent)]'
    case 'polygon':
      return 'bg-[color-mix(in_srgb,#8b5cf6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#8b5cf6_24%,transparent)]'
    case 'optimism':
      return 'bg-[color-mix(in_srgb,#ef4444_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#ef4444_24%,transparent)]'
    case 'base':
      return 'bg-[color-mix(in_srgb,#3b82f6_14%,transparent)] text-[var(--ink-strong)] border-[color-mix(in_srgb,#3b82f6_24%,transparent)]'
    default:
      return 'bg-[var(--surface-2)] text-[var(--ink-strong)] border-[var(--border-soft)]'
  }
}

export default function AddressCard({
  label,
  chain,
  address,
  link,
  notes
}: {
  label: string
  chain: string
  address: string
  link?: string
  notes?: string
}) {
  return (
    <Card interactive>
      <div className='flex items-center justify-between mb-2'>
        <div className='text-sm text-muted'>{label}</div>
        <span className={`rounded-lg border px-2 py-0.5 text-xs font-medium ${getChainColor(chain)}`}>
          {chain}
        </span>
      </div>
      <div className='mt-1 font-mono text-sm p-2 rounded border bg-[var(--surface-2)] dark:bg-[rgba(0,0,0,.35)]'>{address}</div>
      {link && (
        <a 
          className='mt-2 inline-block text-sm underline hover:text-brand-orange transition-colors' 
          href={link} 
          target='_blank'
          rel="noopener noreferrer"
        >
          View on explorer
        </a>
      )}
      {notes && <div className='mt-2 text-sm text-muted'>{notes}</div>}
    </Card>
  )
}