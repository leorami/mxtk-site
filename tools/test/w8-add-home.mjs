const base = process.env.BASE_URL || 'http://localhost:2000'
async function main(){
  const r = await fetch(base + '/api/ai/home/add', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ widget: { type: 'summary', title: 'MXTK Overview', data: { text: 'hello' } } }) })
  if (!r.ok) throw new Error('add failed')
  console.log('added')
}
main().catch(e=>{ console.error(e); process.exit(1); })


