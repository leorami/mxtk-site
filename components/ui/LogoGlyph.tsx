"use client";
// TODO: Replace <g> with your true MXTK glyph path(s) when ready.
export default function LogoGlyph({ size = 14, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden role="img" focusable="false" className={className} xmlns="http://www.w3.org/2000/svg">
      <g fill="currentColor">
        <path d="M32 3 L57 18 L57 46 L32 61 L7 46 L7 18 Z" />
        <path d="M32 10 L49 21 L49 43 L32 54 L15 43 L15 21 Z" opacity=".35" />
      </g>
    </svg>
  );
}


