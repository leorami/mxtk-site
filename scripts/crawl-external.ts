/*
  Crawl an external website and archive HTML pages into docs/reference/external/<host>/<timestamp>/

  Usage examples:
    pnpm tsx scripts/crawl-external.ts --base https://mineral-token.com --depth 2
    pnpm tsx scripts/crawl-external.ts --domain mineral-token.com --depth 3 --maxPages 500

  Notes:
  - Only crawls within the specified host (and www. subdomain variant)
  - Saves robots.txt and sitemap.xml when available
  - Creates urls.txt, pages.json, and snapshot.json metadata files
*/

/* eslint-disable no-console */

import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

type CliArgs = {
  base?: string;
  domain?: string;
  depth?: number;
  maxPages?: number;
  out?: string;
};

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base' && argv[i + 1]) args.base = argv[++i];
    else if (a === '--domain' && argv[i + 1]) args.domain = argv[++i];
    else if (a === '--depth' && argv[i + 1]) args.depth = Number(argv[++i]);
    else if (a === '--maxPages' && argv[i + 1]) args.maxPages = Number(argv[++i]);
    else if (a === '--out' && argv[i + 1]) args.out = argv[++i];
  }
  return args;
}

function toTimestamp(): string {
  // ISO8601 without colons for file-system safety
  const d = new Date().toISOString().replace(/:/g, '-');
  return d;
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function toLocalPath(rawDir: string, urlStr: string): string {
  const u = new URL(urlStr);
  let pathname = u.pathname || '/';
  if (pathname.endsWith('/')) {
    pathname = pathname + 'index.html';
  } else if (!path.basename(pathname).includes('.')) {
    pathname = pathname + '.html';
  }
  return path.join(rawDir, pathname.replace(/^\/+/, ''));
}

function isLikelyHtmlContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  return /text\/html|application\/xhtml\+xml/i.test(contentType);
}

function shouldCrawlUrl(u: URL, allowedHosts: Set<string>): boolean {
  if (!['http:', 'https:'].includes(u.protocol)) return false;
  if (!allowedHosts.has(u.host)) return false;
  // Skip obvious static assets
  const assetExt = [
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg',
    '.css', '.js', '.mjs', '.json', '.ico', '.pdf', '.woff', '.woff2', '.ttf', '.eot', '.map'
  ];
  const lowerPath = u.pathname.toLowerCase();
  if (assetExt.some(ext => lowerPath.endsWith(ext))) return false;
  return true;
}

async function fetchText(url: string, init?: RequestInit): Promise<{ ok: boolean; status: number; text?: string; contentType: string | null; }>
{
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MXTK-Crawler/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      redirect: 'follow',
      ...init,
    });
    const contentType = res.headers.get('content-type');
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, contentType };
  } catch (e) {
    return { ok: false, status: 0, contentType: null };
  }
}

async function fetchBuffer(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MXTK-Crawler/1.0)'
      },
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const arr = new Uint8Array(await res.arrayBuffer());
    return Buffer.from(arr);
  } catch {
    return null;
  }
}

async function run() {
  const args = parseArgs(process.argv);
  const baseUrl = args.base ?? (args.domain ? `https://${args.domain}` : 'https://mineral-token.com');
  const u = new URL(baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
  const host = u.host; // includes www if present
  const coreDomain = host.replace(/^www\./, '');
  const allowedHosts = new Set<string>([coreDomain, `www.${coreDomain}`]);
  const depthLimit = Number.isFinite(args.depth!) ? Math.max(0, args.depth!) : 2;
  const maxPages = Number.isFinite(args.maxPages!) ? Math.max(1, args.maxPages!) : 1000;

  const outRoot = args.out ?? path.join('docs', 'reference', 'external', coreDomain);
  const timestamp = toTimestamp();
  const snapshotDir = path.join(outRoot, timestamp);
  const rawDir = path.join(snapshotDir, 'raw');
  ensureDir(rawDir);

  // Save robots.txt and sitemap.xml if available
  const robots = await fetchBuffer(`https://${coreDomain}/robots.txt`);
  if (robots) {
    fs.writeFileSync(path.join(snapshotDir, 'robots.txt'), robots);
  }
  const sitemap = await fetchBuffer(`https://${coreDomain}/sitemap.xml`);
  if (sitemap) {
    fs.writeFileSync(path.join(snapshotDir, 'sitemap.xml'), sitemap);
  }

  const queue: Array<{ url: string; depth: number }>= [ { url: u.toString(), depth: 0 } ];
  const visited = new Set<string>();
  const discovered: string[] = [];
  const pageMeta: Array<{ url: string; title?: string; status: number }>= [];

  while (queue.length && discovered.length < maxPages) {
    const item = queue.shift()!;
    const currentUrl = item.url;
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    let pageRes: Awaited<ReturnType<typeof fetchText>>;
    try {
      pageRes = await fetchText(currentUrl);
    } catch {
      continue;
    }

    const status = pageRes.status;
    const contentType = pageRes.contentType ?? '';
    const isHtml = isLikelyHtmlContentType(contentType) || /<html[\s\S]*?>/i.test(pageRes.text ?? '');
    if (!pageRes.ok || !isHtml || !pageRes.text) {
      // Skip non-HTML resources
      continue;
    }

    // Save HTML
    const localPath = toLocalPath(rawDir, currentUrl);
    ensureDir(path.dirname(localPath));
    fs.writeFileSync(localPath, pageRes.text, 'utf8');

    discovered.push(currentUrl);

    // Extract links and basic title for metadata
    let title: string | undefined;
    try {
      const m = pageRes.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (m) title = m[1].trim();
    } catch {}
    pageMeta.push({ url: currentUrl, title, status });

    if (item.depth < depthLimit) {
      // Extract hrefs quickly using regex; we purposefully avoid heavy DOM deps
      const hrefs = Array.from(pageRes.text.matchAll(/href\s*=\s*['\"]([^'\"#?]+(?:\?[^'\"]*)?)['\"]/gi))
        .map(m => m[1])
        .filter(Boolean);

      for (const href of hrefs) {
        let next: URL;
        try {
          next = new URL(href, currentUrl);
        } catch {
          continue;
        }
        if (!shouldCrawlUrl(next, allowedHosts)) continue;
        const normalized = next.toString();
        if (!visited.has(normalized)) {
          queue.push({ url: normalized, depth: item.depth + 1 });
        }
      }
    }

    // be polite
    await sleep(200);
  }

  // Write metadata files
  fs.writeFileSync(path.join(snapshotDir, 'urls.txt'), discovered.sort().join('\n'), 'utf8');
  fs.writeFileSync(path.join(snapshotDir, 'pages.json'), JSON.stringify(pageMeta, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(snapshotDir, 'snapshot.json'),
    JSON.stringify({
      baseUrl: u.toString(),
      host: coreDomain,
      timestamp,
      totalPages: discovered.length,
      depthLimit,
      maxPages,
      userAgent: 'MXTK-Crawler/1.0'
    }, null, 2),
    'utf8'
  );

  console.log(`SNAPSHOT_DIR=${snapshotDir}`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});


