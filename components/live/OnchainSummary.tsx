'use client'

import Card from '@/components/ui/Card'
import { useApi } from './useApi'

export default function OnchainSummary() {
    const { data, loading, error } = useApi<{ address: string; name: string; symbol: string; decimals: number; totalSupply: number }>('/api/token/summary')

    return (
        <Card interactive tint="teal">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-muted">Token</div>
                    <div className="text-lg font-semibold">{loading ? 'Loading…' : error ? '—' : `${data?.name} (${data?.symbol})`}</div>
                    <div className="text-xs mt-1">{data?.address}</div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted">Total Supply</div>
                    <div className="text-lg font-semibold">{loading ? '—' : data ? data.totalSupply.toLocaleString() : '—'}</div>
                </div>
            </div>
        </Card>
    )
}
