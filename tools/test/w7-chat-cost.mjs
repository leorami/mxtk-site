const base = process.env.BASE_URL || 'http://localhost:2000';
async function main() {
  const r = await fetch(base + '/api/ai/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ message: 'hello', mode: 'learn' }),
  });
  if (!r.ok) throw new Error('chat failed');
  console.log('chat ok');
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});


