'use client'


type WavePage = 'home' | 'owners'
type WavePos = 'top' | 'bottom'

type Props = {
  page: WavePage;
  position: WavePos;
  height?: number;
  overlap?: number;
  className?: string;
};

export default function WaveBand({
  page,
  position,
  height = 160,
  overlap = 32,
  className = '',
}: Props) {
  // Deprecated: waves are no longer used with pinned photographic backgrounds
  return null
}


