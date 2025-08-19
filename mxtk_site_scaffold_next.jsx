# MXTK Site Scaffold — Next.js App Router + Tailwind + Directus (Open Source CMS)

> Purpose: a production‑grade scaffold matching our agreed IA, with placeholders for proofs/oracle/KYC/escrow, Light default + Dark toggle, Transparency Hub, and MXTK Gives.

## 0) File tree
```
mxkt-site/
├─ app/
│  ├─ (marketing)/
│  │  ├─ page.tsx                  # Home
│  │  ├─ owners/page.tsx           # For Mineral Owners
│  │  ├─ institutions/page.tsx     # For Traders & Institutions
│  │  ├─ transparency/page.tsx     # Trust & Transparency hub
│  │  ├─ whitepaper/page.tsx       # Placeholder copy (swap to MDX later)
│  │  ├─ roadmap/page.tsx          # Milestones
│  │  ├─ elite-drop/page.tsx       # MXTK Gives (program overview)
│  │  └─ elite-drop/nominate/page.tsx # Nomination form (placeholder)
│  ├─ api/
│  │  ├─ status/route.ts           # health + preview metrics
│  │  ├─ proofs/route.ts           # proxy to Directus (or local placeholders)
│  │  └─ oracle/route.ts           # oracle version log (placeholders)
│  ├─ layout.tsx
│  └─ globals.css
├─ components/
│  ├─ ui/
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ Badge.tsx
│  │  └─ Input.tsx
│  ├─ SiteHeader.tsx
│  ├─ SiteFooter.tsx
│  ├─ ThemeToggle.tsx
│  ├─ CookieConsent.tsx
│  ├─ StatTile.tsx
│  ├─ DataSourceBadge.tsx
│  ├─ AddressCard.tsx
│  ├─ ProofTable.tsx
│  └─ OracleLog.tsx
├─ lib/
│  ├─ config.ts
│  ├─ directus.ts
│  └─ placeholders.ts
├─ public/
│  ├─ logo.svg
│  └─ favicon.ico
├─ styles/
│  └─ theme.css                    # CSS vars for Light/Dark + accents
├─ directus/
│  ├─ schema.json                  # Collections + fields (Directus)
│  └─ seed.json                    # Placeholder records for local testing
├─ .env.example
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ tailwind.config.ts
└─ tsconfig.json
```

---

## 1) package.json
```json
{
  "name": "mxtk-site",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "clsx": "2.1.1",
    "tailwindcss": "3.4.7",
    "autoprefixer": "10.4.19",
    "postcss": "8.4.31",
    "viem": "2.10.9",
    "wagmi": "2.12.10",
    "zod": "3.23.8",
    "dayjs": "1.11.11"
  },
  "devDependencies": {
    "@types/react": "18.2.66",
    "@types/node": "20.12.12",
    "typescript": "5.5.4"
  }
}
```

## 2) next.config.mjs
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};
export default nextConfig;
```

## 3) tailwind.config.ts
```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        copper: 'var(--copper)',
        border: 'var(--border)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: []
};
export default config;
```

## 4) styles/theme.css
```css
:root { /* Light default */
  --bg: #F7F9FC;
  --surface: #FFFFFF;
  --ink: #0E1116;
  --muted: #5B6572;
  --accent: #0FBF9F; /* teal */
  --copper: #B87333; /* subtle mineral nod */
  --border: #E5E9F0;
}

.dark {
  --bg: #0B0E12;
  --surface: #12161C;
  --ink: #E6EAF2;
  --muted: #9AA3AE;
  --accent: #00D1B2;
  --copper: #C97E3D;
  --border: #1E2430;
}
```

## 5) app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import '../styles/theme.css';

html, body { height: 100%; }
body { background: theme('colors.bg'); color: theme('colors.ink'); }

/* tables */
.table { @apply w-full text-sm; }
.table th { @apply text-left text-muted border-b border-border py-2; }
.table td { @apply border-b border-border py-2; }
```

## 6) app/layout.tsx
```tsx
import './globals.css';
import { ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieConsent from '@/components/CookieConsent';

export const metadata = {
  title: 'Mineral Token (MXTK)',
  description: 'Digitizing verified mineral interests with transparent proofs, governed pricing, and institutional-grade market plumbing.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-ink">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CookieConsent />
        </div>
      </body>
    </html>
  );
}
```

## 7) components/ui primitives
### Button.tsx
```tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium',
        'bg-accent text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className
      )}
      {...props}
    />
  );
}
```

### Card.tsx
```tsx
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('rounded-2xl bg-surface p-5 shadow-sm border border-border', className)} {...props} />;
}
```

### Badge.tsx
```tsx
import { HTMLAttributes } from 'react';
import clsx from 'clsx';
export default function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={clsx('inline-flex items-center rounded-full bg-border px-2 py-1 text-xs text-muted', className)} {...props} />;
}
```

### Input.tsx
```tsx
import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={clsx('w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent', className)} {...props} />
  );
}
```

## 8) components (site)
### SiteHeader.tsx
```tsx
'use client';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="MXTK" className="h-6 w-6" />
          <span>MXTK</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/owners">Owners</Link>
          <Link href="/institutions">Institutions</Link>
          <Link href="/transparency">Transparency</Link>
          <Link href="/whitepaper">Whitepaper</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/elite-drop">MXTK Gives</Link>
          <Link href="/media">Media</Link>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

### SiteFooter.tsx
```tsx
export default function SiteFooter() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto max-w-6xl px-4 text-sm text-muted">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Mineral Token (MXTK). All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/legal/terms">Terms</a>
            <a href="/legal/privacy">Privacy</a>
            <a href="/legal/disclosures">Disclosures</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

### ThemeToggle.tsx
```tsx
'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = document.documentElement.classList.contains('dark');
  const toggle = () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  };
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') document.documentElement.classList.add('dark');
  }, []);

  return (
    <button onClick={toggle} className="rounded-xl border border-border px-3 py-1 text-sm">
      {isDark ? 'Light' : 'Dark'} mode
    </button>
  );
}
```

### CookieConsent.tsx
```tsx
'use client';
import { useEffect, useState } from 'react';
import Button from './ui/Button';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-3xl -translate-x-1/2 rounded-2xl border border-border bg-surface p-4 shadow-lg">
      <p className="text-sm text-muted">We use privacy-friendly analytics. No tracking until you consent.</p>
      <div className="mt-3 flex gap-3">
        <Button onClick={() => { localStorage.setItem('cookie-consent', 'accepted'); setVisible(false);} }>Accept</Button>
        <button className="text-sm underline" onClick={() => { localStorage.setItem('cookie-consent', 'declined'); setVisible(false);} }>Decline</button>
      </div>
    </div>
  );
}
```

### StatTile.tsx
```tsx
import Card from './ui/Card';
import DataSourceBadge from './DataSourceBadge';

export default function StatTile({ label, value, source, preview=false }:{label:string; value:string; source?:string; preview?:boolean}){
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
        <DataSourceBadge source={source} preview={preview} />
      </div>
    </Card>
  );
}
```

### DataSourceBadge.tsx
```tsx
import Badge from './ui/Badge';
export default function DataSourceBadge({ source, preview=false }:{source?:string; preview?:boolean}){
  if (preview) return <Badge>Preview data</Badge>;
  if (!source) return null;
  return <Badge>Source: {source}</Badge>;
}
```

### AddressCard.tsx
```tsx
import Card from './ui/Card';

export default function AddressCard({ label, chain, address, link, notes }:{label:string; chain:string; address:string; link?:string; notes?:string}){
  return (
    <Card>
      <div className="text-sm text-muted">{label} • {chain}</div>
      <div className="mt-1 font-mono text-sm">{address}</div>
      {link && <a className="mt-2 inline-block text-sm underline" href={link} target="_blank">View on explorer</a>}
      {notes && <div className="mt-2 text-sm text-muted">{notes}</div>}
    </Card>
  );
}
```

### ProofTable.tsx
```tsx
import Card from './ui/Card';

type Proof = { id:string; title:string; type:string; issuer:string; effectiveDate:string; cid:string; sha256:string };

export default function ProofTable({ proofs }:{ proofs: Proof[] }){
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Issuer</th>
              <th>Effective</th>
              <th>IPFS CID</th>
              <th>Hash</th>
            </tr>
          </thead>
          <tbody>
            {proofs.map(p => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.type}</td>
                <td>{p.issuer}</td>
                <td>{p.effectiveDate}</td>
                <td><a className="underline" href={`https://ipfs.io/ipfs/${p.cid}`} target="_blank">{p.cid.slice(0, 12)}…</a></td>
                <td className="font-mono text-xs">{p.sha256.slice(0, 12)}…</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
```

### OracleLog.tsx
```tsx
import Card from './ui/Card';

type Entry = { version:string; effectiveAt:string; summary:string; cid?:string };
export default function OracleLog({ entries }:{ entries: Entry[] }){
  return (
    <Card>
      <ol className="space-y-4">
        {entries.map((e, i) => (
          <li key={i} className="border-l-2 border-border pl-3">
            <div className="text-sm text-muted">{e.effectiveAt}</div>
            <div className="font-semibold">Oracle {e.version}</div>
            <div className="text-sm">{e.summary}</div>
            {e.cid && <a className="text-sm underline" href={`https://ipfs.io/ipfs/${e.cid}`} target="_blank">Methodology (PDF)</a>}
          </li>
        ))}
      </ol>
    </Card>
  );
}
```

### OpsCostEstimator.tsx
```tsx
import Card from './ui/Card';

export default function OpsCostEstimator({ l2Gas, calldataBytes }:{ l2Gas:number; calldataBytes:number }){
  // Preview constants tuned to the engineering example
  const ETH_USD = 4287.48; // placeholder
  const L2_GWEI = 0.01;    // placeholder
  const L1_GWEI = 0.16;    // placeholder
  const L1_GAS_PER_BYTE = 16;

  const l1Gas = calldataBytes * L1_GAS_PER_BYTE;
  const l2Eth = l2Gas * L2_GWEI * 1e-9;
  const l1Eth = l1Gas * L1_GWEI * 1e-9;
  const totalEth = l2Eth + l1Eth; // ≈ 0.000002807 with these constants
  const usd = totalEth * ETH_USD;

  return (
    <Card>
      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="text-muted">Estimated cost (preview):</span>{' '}
          <span className="font-semibold">${usd.toFixed(4)}</span>{' '}
          <span className="text-muted">per operation</span>
        </div>
        <div className="text-muted">Inputs: L2 gas {l2Gas.toLocaleString()} @ {L2_GWEI} gwei; L1 calldata {calldataBytes} bytes × {L1_GAS_PER_BYTE} gas/byte @ {L1_GWEI} gwei; ETH/USD {ETH_USD}.</div>
      </div>
    </Card>
  );
}
```

### Footnote.tsx
```tsx
export default function Footnote({ children }:{ children: React.ReactNode }){
  return <p className="mt-3 text-xs text-muted">{children}</p>;
}
```


## 9) lib/placeholders.ts
```ts
export const PLACEHOLDER_ADDRESSES = [
  { label: 'Token (Arbitrum)', chain: 'Arbitrum', address: '0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba', link: 'https://arbiscan.io/token/0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba' },
  { label: 'Uniswap v3 Pool (placeholder)', chain: 'Arbitrum', address: '0xPOOLPLACEHOLDER', notes: 'Pool to be announced; range orders at 0.05% and 0.30% fee tiers planned.' },
  { label: 'LP Locker (placeholder)', chain: 'Arbitrum', address: '0xLOCKPLACEHOLDER', notes: 'Lock contract and terms to be posted upon deployment.' },
  { label: 'Multisig (placeholder)', chain: 'Arbitrum', address: '0xMULTISIGPLACEHOLDER', notes: '3-of-5 multisig; timelock parameters TBD.' }
];

export const PLACEHOLDER_PROOFS = [
  { id: '1', title: 'JORC Technical Report — Project A (Redacted)', type: 'JORC', issuer: 'Acme Geo Pty Ltd', effectiveDate: '2025-07-31', cid: 'bafybeihdummydummydummy1', sha256: 'DUMMY-HASH-1' },
  { id: '2', title: 'NI 43-101 Summary — Project B (Executive Summary)', type: 'NI43-101', issuer: 'NorthStar Mining Advisors', effectiveDate: '2025-06-15', cid: 'bafybeihdummydummydummy2', sha256: 'DUMMY-HASH-2' },
  { id: '3', title: 'SKR Letter — Custodian Ref #SKR-2025-001', type: 'SKR', issuer: 'Global Trust Custodial Ltd.', effectiveDate: '2025-08-01', cid: 'bafybeihdummydummydummy3', sha256: 'DUMMY-HASH-3' }
];

export const PLACEHOLDER_ORACLE_LOG = [
  { version: 'v0.1 (Preview)', effectiveAt: '2025-08-20', summary: 'Initial preview spec; non-binding; no price authority.', cid: 'bafybeioraclemethod-dummy' }
];

// Ops cost defaults used by the estimator (preview only)
export const OPS_COST_DEFAULTS = {
  l2Gas: 255000,
  calldataBytes: 101,
  l2GasPriceGwei: 0.01,
  l1GasPriceGwei: 0.16,
  l1GasPerByte: 16,
  ethUsd: 4287.48
};
```


## 10) lib/config.ts
```ts
export const SITE = {
  name: 'Mineral Token (MXTK)',
  email: 'hello@mineral-token.com',
  givesEmail: 'gives@mineral-token.com'
};

export const PLACEHOLDER_PARTNERS = {
  kyc: 'Persona (placeholder)',
  escrow: 'BitGo (placeholder)'
};
```

## 11) app/(marketing)/page.tsx (Home)
```tsx
import Card from '@/components/ui/Card';
import StatTile from '@/components/StatTile';
import { PLACEHOLDER_ORACLE_LOG, PLACEHOLDER_PROOFS } from '@/lib/placeholders';

export default function HomePage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="grid gap-6 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold">Digitizing verified mineral interests</h1>
          <p className="mt-3 text-muted">Transparent proofs, governed pricing, and institutional‑grade market plumbing. Light theme by default; Dark for power users.</p>
        </div>
        <Card>
          <p className="text-sm text-muted">Proof at a glance</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <StatTile label="# Published proofs" value={`${PLACEHOLDER_PROOFS.length}`} preview />
            <StatTile label="Oracle" value={PLACEHOLDER_ORACLE_LOG[0].version} preview />
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <Card><h3 className="font-semibold">For Mineral Owners</h3><p className="mt-2 text-sm text-muted">Qualify (JORC/NI 43‑101/SKR), verify with independent experts, and tokenize with clear custody.</p></Card>
        <Card><h3 className="font-semibold">For Institutions</h3><p className="mt-2 text-sm text-muted">Governed oracle, on‑chain addresses, liquidity plans, and OTC rails with KYC/escrow (placeholders).</p></Card>
        <Card><h3 className="font-semibold">Trust & Transparency</h3><p className="mt-2 text-sm text-muted">Every claim documented; every change logged; every address public.</p></Card>
      </section>
    </div>
  );
}
```

## 12) app/(marketing)/owners/page.tsx
```tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OwnersPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">For Mineral Owners</h1>
      <Card>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Qualify your asset (JORC / NI 43‑101 / SKR).</li>
          <li>Independent verification and legal chain‑of‑title.</li>
          <li>Tokenization with clear custody and on‑chain addresses.</li>
        </ol>
        <div className="mt-4">
          <Button>Start the conversation</Button>
        </div>
      </Card>
      <Card>
        <h3 className="font-semibold">Accepted standards</h3>
        <p className="mt-2 text-sm text-muted">JORC (2012), NI 43‑101, and SKR with clear custodial documentation.</p>
      </Card>
    </div>
  );
}
```

## 13) app/(marketing)/institutions/page.tsx
```tsx
import Card from '@/components/ui/Card';
import AddressCard from '@/components/AddressCard';
import { PLACEHOLDER_ADDRESSES } from '@/lib/placeholders';
import { PLACEHOLDER_PARTNERS } from '@/lib/config';
import OpsCostEstimator from '@/components/OpsCostEstimator';
import Footnote from '@/components/Footnote';

export default function InstitutionsPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">For Traders & Institutions</h1>

      <Card>
        <p className="text-sm text-muted">Liquidity & on‑chain addresses (preview)</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {PLACEHOLDER_ADDRESSES.map((a) => (
            <AddressCard key={a.address} {...a} />
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Why Arbitrum</h3>
        <p className="mt-2 text-sm text-muted">Efficient on‑chain operations keep per‑operation fees low and predictable, enabling hundreds of daily updates without material cost. Actual fees vary with network gas and ETH price.</p>
        <div className="mt-4">
          <OpsCostEstimator l2Gas={255000} calldataBytes={101} />
        </div>
        <Footnote>Figures shown are engineering estimates for layout/demo only. Live metrics will replace this model once monitoring is connected.</Footnote>
      </Card>

      <Card>
        <h3 className="font-semibold">OTC workflow</h3>
        <p className="mt-2 text-sm text-muted">KYC/AML provider: <strong>{PLACEHOLDER_PARTNERS.kyc}</strong>. Escrow/Custody: <strong>{PLACEHOLDER_PARTNERS.escrow}</strong>. Partners shown are placeholders for layout; final providers will be announced with signed agreements.</p>
      </Card>
    </div>
  );
}
```

## 14) app/(marketing)/transparency/page.tsx
```tsx
import ProofTable from '@/components/ProofTable';
import OracleLog from '@/components/OracleLog';
import Card from '@/components/ui/Card';
import AddressCard from '@/components/AddressCard';
import OpsCostEstimator from '@/components/OpsCostEstimator';
import Footnote from '@/components/Footnote';
import { PLACEHOLDER_ADDRESSES, PLACEHOLDER_ORACLE_LOG, PLACEHOLDER_PROOFS } from '@/lib/placeholders';

export default function TransparencyPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Trust & Transparency</h1>

      <section className="space-y-4">
        <h2 className="font-semibold">Attestations & audits (preview)</h2>
        <ProofTable proofs={PLACEHOLDER_PROOFS} />
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Oracle methodology & change log</h2>
        <OracleLog entries={PLACEHOLDER_ORACLE_LOG} />
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">Operations Cost & Throughput (Preview)</h2>
        <p className="text-sm text-muted">We estimate the fee for a standard atomic swap/update on Arbitrum by combining L2 execution gas with L1 calldata cost. At today’s assumptions, the model estimates ≈ $0.01–$0.02 per operation.</p>
        <OpsCostEstimator l2Gas={255000} calldataBytes={101} />
        <Footnote>These are engineering estimates using placeholder gas prices and ETH‑USD. Live metrics will replace this model once monitoring is connected.</Footnote>
      </section>

      <section className="space-y-4">
        <h2 className="font-semibold">On‑chain addresses</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {PLACEHOLDER_ADDRESSES.map(a => <AddressCard key={a.address} {...a} />)}
        </div>
      </section>

      <Card>
        <h2 className="font-semibold">Risk factors (summary)</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-muted">
          <li>Price stability depends on verified backing, governed oracle, and funded/locked liquidity.</li>
          <li>OTC operations subject to KYC/AML and settlement risks.</li>
          <li>Regulatory classification subject to jurisdiction and offering facts.</li>
        </ul>
      </Card>
    </div>
  );
}
```

## 15) app/(marketing)/whitepaper/page.tsx
```tsx
export default function Whitepaper(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Whitepaper (Preview)</h1>
      <p className="text-sm text-muted">This page will render MDX in production. For now, it provides a concise overview of MXTK mechanics, governance, and market structure with links to proofs and on‑chain addresses.</p>
    </div>
  );
}
```

## 16) app/(marketing)/roadmap/page.tsx
```tsx
import Card from '@/components/ui/Card';

export default function Roadmap(){
  const items = [
    { title: 'Transparency hub online', status: 'Delivered', date: '2025-08-20' },
    { title: 'Oracle v0.1 (preview) published', status: 'Delivered', date: '2025-08-20' },
    { title: 'First LP lock (public address)', status: 'Planned', date: 'TBD' }
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Roadmap</h1>
      <div className="space-y-3">
        {items.map((i, idx) => (
          <Card key={idx}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{i.title}</div>
                <div className="text-sm text-muted">{i.status}</div>
              </div>
              <div className="text-sm text-muted">{i.date}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

## 17) app/(marketing)/elite-drop/page.tsx (MXTK Gives)
```tsx
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function EliteDrop(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">MXTK Gives: nominate your nonprofit</h1>
      <Card>
        <p className="text-sm">We’re committing up to $10 million (today’s dollars) in MXTK to approximately 100 nonprofits. If your organization is outcomes‑driven and ready to explore new ways to finance impact, nominate your team for consideration.</p>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted">
          <li>Accept the MXTK grant and agree to a defined lock period.</li>
          <li>Work with us to learn how to leverage locked assets (including borrowing while locked).</li>
          <li>Share your experience so others can learn.</li>
        </ul>
        <div className="mt-4">
          <Button as-child>
            {/* @ts-expect-error server Link types */}
            <a href="/elite-drop/nominate">Start the nomination</a>
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted">Partner: Encast (encast.gives). This is a preview; full program terms will be published at launch.</p>
      </Card>
    </div>
  );
}
```

## 18) app/(marketing)/elite-drop/nominate/page.tsx
```tsx
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function Nominate(){
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Nominate your nonprofit (preview)</h1>
      <Card>
        <div className="grid gap-3">
          <Input placeholder="Organization name" />
          <Input placeholder="Website" />
          <Input placeholder="Contact name" />
          <Input placeholder="Email" />
          <Input placeholder="Country" />
          <Input placeholder="501(c)(3) or global equivalent?" />
          <Input placeholder="Brief: how you’d use MXTK" />
          <Button>Submit nomination</Button>
          <p className="text-xs text-muted">Submissions are saved for review. This is a preview form; final compliance checks (KYC/verification) will be required.</p>
        </div>
      </Card>
    </div>
  );
}
```

## 19) app/api/status/route.ts
```ts
import { NextResponse } from 'next/server';
export async function GET(){
  return NextResponse.json({
    ok: true,
    preview: true,
    metrics: {
      publishedProofs: 3,
      oracle: 'v0.1 (Preview)'
    }
  });
}
```

## 20) app/api/proofs/route.ts (proxy stub)
```ts
import { NextResponse } from 'next/server';
import { PLACEHOLDER_PROOFS } from '@/lib/placeholders';
export async function GET(){
  // TODO: when Directus is live, fetch from `${process.env.DIRECTUS_URL}/items/proof_documents`
  return NextResponse.json({ items: PLACEHOLDER_PROOFS });
}
```

## 21) app/api/oracle/route.ts (proxy stub)
```ts
import { NextResponse } from 'next/server';
import { PLACEHOLDER_ORACLE_LOG } from '@/lib/placeholders';
export async function GET(){
  return NextResponse.json({ items: PLACEHOLDER_ORACLE_LOG });
}
```

## 22) lib/directus.ts (client placeholder)
```ts
export function getDirectusURL(){
  return process.env.DIRECTUS_URL || '';
}
export function getDirectusToken(){
  return process.env.DIRECTUS_STATIC_TOKEN || '';
}
```

## 23) .env.example
```
# Next.js
NODE_ENV=development

# Directus (optional for preview)
DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=changeme

# Analytics
PLAUSIBLE_DOMAIN=mineral-token.com
```

## 24) directus/schema.json (collections minimal)
```json
{
  "collections": [
    {"collection": "proof_documents", "meta": {"icon": "article"}, "schema": {"name": "proof_documents"}},
    {"collection": "oracle_versions", "meta": {"icon": "rule"}, "schema": {"name": "oracle_versions"}},
    {"collection": "onchain_addresses", "meta": {"icon": "link"}, "schema": {"name": "onchain_addresses"}},
    {"collection": "otc_monthlies", "meta": {"icon": "insights"}, "schema": {"name": "otc_monthlies"}},
    {"collection": "roadmap_items", "meta": {"icon": "timeline"}, "schema": {"name": "roadmap_items"}}
  ],
  "fields": [
    {"collection": "proof_documents", "field": "title", "type": "string", "schema": {"is_nullable": false}},
    {"collection": "proof_documents", "field": "type", "type": "string"},
    {"collection": "proof_documents", "field": "issuer", "type": "string"},
    {"collection": "proof_documents", "field": "effectiveDate", "type": "date"},
    {"collection": "proof_documents", "field": "cid", "type": "string"},
    {"collection": "proof_documents", "field": "sha256", "type": "string"},

    {"collection": "oracle_versions", "field": "version", "type": "string"},
    {"collection": "oracle_versions", "field": "effectiveAt", "type": "dateTime"},
    {"collection": "oracle_versions", "field": "summary", "type": "text"},
    {"collection": "oracle_versions", "field": "methodology_cid", "type": "string"},

    {"collection": "onchain_addresses", "field": "label", "type": "string"},
    {"collection": "onchain_addresses", "field": "chain", "type": "string"},
    {"collection": "onchain_addresses", "field": "address", "type": "string"},
    {"collection": "onchain_addresses", "field": "link", "type": "string"},
    {"collection": "onchain_addresses", "field": "notes", "type": "text"},

    {"collection": "otc_monthlies", "field": "month", "type": "date"},
    {"collection": "otc_monthlies", "field": "totalCounterparties", "type": "integer"},
    {"collection": "otc_monthlies", "field": "grossInflowUSD", "type": "decimal"},
    {"collection": "otc_monthlies", "field": "grossOutflowUSD", "type": "decimal"},
    {"collection": "otc_monthlies", "field": "netUSD", "type": "decimal"},
    {"collection": "otc_monthlies", "field": "avgTicket", "type": "decimal"},
    {"collection": "otc_monthlies", "field": "notes", "type": "text"},

    {"collection": "roadmap_items", "field": "title", "type": "string"},
    {"collection": "roadmap_items", "field": "status", "type": "string"},
    {"collection": "roadmap_items", "field": "targetDate", "type": "date"},
    {"collection": "roadmap_items", "field": "details", "type": "text"}
  ]
}
```

## 25) directus/seed.json (placeholder rows)
```json
{
  "proof_documents": [
    {"title": "JORC Technical Report — Project A (Redacted)", "type": "JORC", "issuer": "Acme Geo Pty Ltd", "effectiveDate": "2025-07-31", "cid": "bafybeihdummydummydummy1", "sha256": "DUMMY-HASH-1"},
    {"title": "NI 43-101 Summary — Project B (Executive Summary)", "type": "NI43-101", "issuer": "NorthStar Mining Advisors", "effectiveDate": "2025-06-15", "cid": "bafybeihdummydummydummy2", "sha256": "DUMMY-HASH-2"},
    {"title": "SKR Letter — Custodian Ref #SKR-2025-001", "type": "SKR", "issuer": "Global Trust Custodial Ltd.", "effectiveDate": "2025-08-01", "cid": "bafybeihdummydummydummy3", "sha256": "DUMMY-HASH-3"}
  ],
  "oracle_versions": [
    {"version": "v0.1 (Preview)", "effectiveAt": "2025-08-20T00:00:00Z", "summary": "Initial preview spec; non-binding; no price authority.", "methodology_cid": "bafybeioraclemethod-dummy"}
  ],
  "onchain_addresses": [
    {"label": "Token (Arbitrum)", "chain": "Arbitrum", "address": "0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba", "link": "https://arbiscan.io/token/0x3e4Ffeb394B371AAaa0998488046Ca19d870d9Ba"},
    {"label": "Uniswap v3 Pool (placeholder)", "chain": "Arbitrum", "address": "0xPOOLPLACEHOLDER", "notes": "Pool to be announced; range orders at 0.05% and 0.30% fee tiers planned."},
    {"label": "LP Locker (placeholder)", "chain": "Arbitrum", "address": "0xLOCKPLACEHOLDER", "notes": "Lock contract and terms to be posted upon deployment."},
    {"label": "Multisig (placeholder)", "chain": "Arbitrum", "address": "0xMULTISIGPLACEHOLDER", "notes": "3-of-5 multisig; timelock parameters TBD."}
  ]
}
```

## 26) app/(marketing)/media/page.tsx
```tsx
import Card from '@/components/ui/Card';

export default function Media(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Media Kit</h1>
      <Card>
        <h3 className="font-semibold">Boilerplate</h3>
        <p className="mt-2 text-sm text-muted">Mineral Token (MXTK) digitizes verified mineral interests with transparent proofs, governed pricing, and institutional‑grade market plumbing.</p>
      </Card>
      <Card>
        <h3 className="font-semibold">Logos & assets</h3>
        <a className="mt-2 inline-block text-sm underline" href="/logo.svg" download>Download logo (SVG)</a>
      </Card>
    </div>
  );
}
```

## 27) next: Plausible snippet (optional)
Add to `app/layout.tsx` just before `</body>` when ready:
```tsx
{/* <script defer data-domain={process.env.PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" /> */}
```

---

### How to run (local)
```
pnpm install
pnpm dev
```
Set up Directus separately if desired; otherwise the site runs entirely on placeholders.

### Notes
- All partners (KYC/escrow) are clearly labeled as placeholders.
- Transparency hub ships first, with CIDs and addresses swapped in later.
- Light theme default for institutions/nonprofits; Dark toggle for crypto-native users.
