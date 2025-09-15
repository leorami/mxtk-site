import StatTile from '@/components/StatTile'

export default function StatsBar() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <StatTile iconColorClass="text-emerald-600" faIcon="fa-gem" label="$33B+" value="Mineral Assets Committed" preview source="mineral-token.com (snapshot)" />
      <StatTile iconColorClass="text-teal-600" faIcon="fa-scale-balanced" label="1:1" value="Asset-Backed Ratio" preview source="mineral-token.com (snapshot)" />
      <StatTile iconColorClass="text-blue-600" faIcon="fa-globe" label="Global" value="Mineral Network" preview source="mineral-token.com (snapshot)" />
    </div>
  )
}
