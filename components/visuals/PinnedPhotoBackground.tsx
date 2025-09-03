"use client";


export default function PinnedPhotoBackground({
  lightSrc,
  darkSrc,
  className = "",
}: { lightSrc: string; darkSrc: string; className?: string }) {
  const light = lightSrc;
  const dark = darkSrc;
  return (
    <div aria-hidden className={`fixed inset-x-0 top-[var(--nav-height,64px)] bottom-[var(--footer-h,64px)] -z-50 pointer-events-none ${className}`}>
      <picture className="block w-full h-full">
        <source srcSet={dark} media="(prefers-color-scheme: dark)" />
        <img src={light} alt="" className="w-full h-full object-cover object-center" loading="eager" />
      </picture>
    </div>
  );
}


