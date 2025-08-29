import { getServerPublicPath } from '@/lib/routing/getPublicPathServer';

export default async function Favicons() {
  const svg = await getServerPublicPath('favicon.svg');
  const ico = await getServerPublicPath('favicon.ico');

  return (
    <>
      <link rel="icon" type="image/svg+xml" href={svg} />
      <link rel="alternate icon" type="image/x-icon" sizes="32x32" href={ico} />
      <link rel="shortcut icon" href={svg} />
      <link rel="apple-touch-icon" href={svg} />
    </>
  );
}
