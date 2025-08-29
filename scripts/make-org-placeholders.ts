// scripts/make-org-placeholders.ts
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const dir = join(process.cwd(), 'public', 'organizations');
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
const transparent1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAt8BXvH3CkQAAAAASUVORK5CYII=','base64');
const names = ['persona','chainlink','bitgo','arbitrum','american-heart-association','american-cancer-society','american-red-cross','march-of-dimes','salvation-army','doctors-without-borders'];
for (const n of names) { const f = join(dir, `${n}.png`); if (!existsSync(f)) writeFileSync(f, transparent1x1); console.log('✓', f); }


