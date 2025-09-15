'use client'

import DataTableGlass from '@/components/ui/DataTableGlass'
import { PoolRow } from '@/lib/data/types'
import { useApi } from './useApi'

type PoolsResp = { pools: PoolRow[] }

export default function PoolsDataTable() {
  const { data, loading, error } = useApi<PoolsResp>('/data/pools', { refreshMs: 300000 })
  if (error) return <div className="text-red-600 text-sm">Failed to load pools</div>
  if (loading || !data) return <div className="text-ink-subtle text-sm">Loading…</div>
  return <DataTableGlass rows={data.pools || []} stackedMobile />
}


