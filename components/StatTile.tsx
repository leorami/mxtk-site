import DataSourceBadge from './DataSourceBadge'
import Badge from './ui/Badge'
import Card from './ui/Card'

export default function StatTile({
  label,
  value,
  source,
  preview = false,
  faIcon,
  colorClass = '',
  iconColorClass = 'text-emerald-600'
}: {
  label: string
  value: string
  source?: string
  preview?: boolean
  faIcon?: string
  colorClass?: string
  iconColorClass?: string
}) {
  return (
    <Card interactive style={{ minWidth: 280, minHeight: 210 }}>
      <div className='flex flex-col items-center text-center p-3'>
        {faIcon ? (
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-2 bg-[rgba(0,0,0,0.06)] dark:bg-[rgba(255,255,255,0.12)] ${colorClass}`}>
            <i className={`fa-solid ${faIcon} text-xl ${iconColorClass}`} aria-hidden />
          </div>
        ) : null}
        <div className='text-xl font-semibold mb-2'>{label}</div>
        <div className='text-sm text-muted mb-1'>{value}</div>
        <div className='mt-1'>
          {preview ? <Badge className='opacity-90'>Preview</Badge> : <DataSourceBadge source={source} />}
        </div>
      </div>
    </Card>
  )
}