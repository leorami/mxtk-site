import 'node-fetch'

const base = process.env.BASE_URL || 'http://localhost:2000'
const tokens = (process.env.MXTK_WARM_TOKENS || '').split(',').map(s => s.trim()).filter(Boolean)
const q = tokens.length ? tokens.map(t => `token=${encodeURIComponent(t)}`).join('&') : ''

const res = await fetch(`${base}/api/data/_warm${q ? `?${q}` : ''}`, {
  method: 'POST',
  headers: {
    'authorization': process.env.ADMIN_TOKEN ? `Bearer ${process.env.ADMIN_TOKEN}` : ''
  }
})

const body = await res.json().catch(() => ({}))
console.log('warm:', body)


