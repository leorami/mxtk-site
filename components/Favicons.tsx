import { getBasePathUrl } from '@/lib/basepath';

export default function Favicons({ basePath = '' }: { basePath?: string }) {
  // SSR-safe prefixer when layout passes server-detected basePath
  const prefix = (p: string) => `${basePath || ''}${p.startsWith('/') ? p : `/${p}`}`
  const href = (p: string) => basePath ? prefix(p) : getBasePathUrl(p)
  return (
    <>
      <link rel="icon" href={href('/favicon.ico')} sizes="any" />
      <link rel="shortcut icon" href={href('/favicon.ico')} />
      <link rel="apple-touch-icon" href={href('/apple-touch-icon.png')} />
      <link rel="manifest" href={href('/manifest.json')} />
    </>
  );
}
