const base = process.env.BASE_URL || 'http://localhost:2000';

async function main() {
  const r1 = await fetch(base + '/api/ai/ingest', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: '# Internal draft\nThis includes patent claims and should be confidential.', source: 'note.md' }),
  });
  if (!r1.ok) throw new Error('ingest failed');

  const r2 = await fetch(base + '/api/ai/flags', { headers: { authorization: 'Bearer ' + (process.env.ADMIN_TOKEN || 'dev') } });
  const j = await r2.json();
  if (!j.ok) throw new Error('flags list failed');
  if (!(j.pending || []).length) throw new Error('nothing pending');

  const id = j.pending[0].id;
  const r3 = await fetch(base + '/api/ai/flags', {
    method: 'PUT',
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (process.env.ADMIN_TOKEN || 'dev') },
    body: JSON.stringify({ id, action: 'approve' }),
  });
  if (!r3.ok) throw new Error('approve failed');
  console.log('OK');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});




