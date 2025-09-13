"use client";
import AppImage from '@/components/ui/AppImage';
export default function MicroMark({ size = 16, className = '' }:{ size?: number; className?: string; }) {
  const clamped = Math.max(12, Math.min(24, size));
  const src = `/art/mxtk_micro_mark_${clamped}.svg`;
  return <AppImage src={src} width={size} height={size} alt="" className={className} />;
}