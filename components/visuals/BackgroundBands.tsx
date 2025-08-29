"use client";

type Variant = "home" | "owners";

export default function BackgroundBands({
  variant,
  top = 220,
  bottom = 200,
  className = "",
}: {
  variant: Variant;
  top?: number;
  bottom?: number;
  className?: string;
}) {
  // Deprecated: wave assets replaced by pinned photographic backgrounds.
  // Keep component as no-op for safety while code references are removed.
  return null;
}

