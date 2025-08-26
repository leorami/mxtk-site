import Card from './ui/Card'

// Color mapping for different chains
const getChainColor = (chain: string) => {
  switch (chain.toLowerCase()) {
    case 'arbitrum':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
    case 'ethereum':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30'
    case 'polygon':
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800/30'
    case 'optimism':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30'
    case 'base':
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/30'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800/30'
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
      <div className='mt-1 font-mono text-sm bg-gray-50 dark:bg-gray-900/50 p-2 rounded border'>{address}</div>
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