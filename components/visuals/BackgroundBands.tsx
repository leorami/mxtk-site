"use client";
import { usePublicPath } from "@/lib/routing/getPublicPathClient";
import cn from "classnames";

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
  const p =
    variant === "home"
      ? {
          // Temporary override: use provided WEBP assets for home top/bottom
          tl: usePublicPath(
            "art/waves/home/dromerodemandfrontier_powerpoint_slide_with_a_white_background__e3464830-74ed-42aa-a014-621d8489dfe9.webp"
          ),
          td: usePublicPath(
            "art/waves/home/dromerodemandfrontier_powerpoint_slide_with_a_white_background__e3464830-74ed-42aa-a014-621d8489dfe9.webp"
          ),
          bl: usePublicPath(
            "art/waves/home/dromerodemandfrontier_powerpoint_slide_with_a_white_background__8d1fce09-dd75-432c-ba88-132b9fe6bb5e.webp"
          ),
          bd: usePublicPath(
            "art/waves/home/dromerodemandfrontier_powerpoint_slide_with_a_white_background__8d1fce09-dd75-432c-ba88-132b9fe6bb5e.webp"
          ),
        }
      : {
          tl: usePublicPath("art/waves/owners/wave_top_light.svg"),
          td: usePublicPath("art/waves/owners/wave_top_dark.svg"),
          bl: usePublicPath("art/waves/owners/wave_bottom_light.svg"),
          bd: usePublicPath("art/waves/owners/wave_bottom_dark.svg"),
        };

  return (
    <div
      aria-hidden
      className={cn(
        // full-bleed, behind everything
        "pointer-events-none absolute inset-x-0 top-0 bottom-0 -z-10",
        className
      )}
    >
      {/* Top band */}
      <picture className="absolute inset-x-0 top-0 block w-full" style={{ height: top }}>
        <source srcSet={p.td} media="(prefers-color-scheme: dark)" />
        <img src={p.tl} alt="" loading="lazy" className="block w-full h-full object-cover" />
      </picture>

      {/* Bottom band */}
      <picture className="absolute inset-x-0 bottom-0 block w-full" style={{ height: bottom }}>
        <source srcSet={p.bd} media="(prefers-color-scheme: dark)" />
        <img src={p.bl} alt="" loading="lazy" className="block w-full h-full object-cover" />
      </picture>
    </div>
  );
}

