import { getBasePathUrl } from '@/lib/basepath';

export default function Favicons() {
  return (
    <>
      <link rel="icon" href={getBasePathUrl('/favicon.ico')} sizes="any" />
      <link rel="shortcut icon" href={getBasePathUrl('/favicon.ico')} />
      <link rel="apple-touch-icon" href={getBasePathUrl('/apple-touch-icon.png')} />
      <link rel="manifest" href={getBasePathUrl('/manifest.json')} />
    </>
  );
}
