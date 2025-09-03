export default function Favicons() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (
    <>
      <link rel="icon" href={`${base}/favicon.ico`} sizes="any" />
      <link rel="shortcut icon" href={`${base}/favicon.ico`} />
    </>
  );
}
