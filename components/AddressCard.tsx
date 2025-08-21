import Card from './ui/Card'

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
      <div className='text-sm text-muted'>{label} • {chain}</div>
      <div className='mt-1 font-mono text-sm'>{address}</div>
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