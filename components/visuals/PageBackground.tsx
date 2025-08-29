"use client";
import { usePublicPath } from "@/lib/routing/getPublicPathClient";

export default function PageBackground({ src }: { src: string }) {
  const img = usePublicPath(src);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}


