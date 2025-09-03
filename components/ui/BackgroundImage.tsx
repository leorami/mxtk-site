'use client';


import clsx from 'clsx';
import React from 'react';

type Fit = 'cover' | 'contain';
type Repeat = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
type Position =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | `${number}% ${number}%`
  | `${number}px ${number}px`;

export interface BackgroundImageProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Path relative to /public, e.g. "minerals/supporting/home_support_hero.jpg" */
  src: string;
  /** Optional overlay color (rgba/hex) placed above the image but below page content */
  overlayColor?: string;
  /** Opacity for the overlay layer (0–1). Default 0.0 (no overlay). */
  overlayOpacity?: number;
  /** Object-fit behavior. Default "cover". */
  fit?: Fit;
  /** Background repeat. Default "no-repeat". */
  repeat?: Repeat;
  /** Background position. Default "center". */
  position?: Position;
  /** Optional extra class for the *image layer* */
  imageClassName?: string;
  /** Optional extra class for the *overlay* */
  overlayClassName?: string;
}

/**
 * Full-size positioned background image wrapper.
 *
 * Renders:
 * <div class="relative ...">
 *   <div class="absolute inset-0" style="background-image: url(getPublicPath(src)) ..."/>
 *   (optional) <div class="absolute inset-0" style="background-color: overlayColor; opacity: overlayOpacity"/>
 * </div>
 *
 * Designed to avoid optimizer issues and SSR/CSR base-path drift by always using getPublicPath().
 */
export default function BackgroundImage({
  src,
  overlayColor,
  overlayOpacity = 0,
  fit = 'cover',
  repeat = 'no-repeat',
  position = 'center',
  className,
  imageClassName,
  overlayClassName,
  ...rest
}: BackgroundImageProps) {
  const url = src;

  return (
    <div className={clsx('relative', className)} {...rest}>
      <div
        aria-hidden
        className={clsx('absolute inset-0', imageClassName)}
        style={{
          backgroundImage: `url(${url})`,
          backgroundSize: fit,
          backgroundRepeat: repeat,
          backgroundPosition: position,
        }}
      />
      {overlayOpacity > 0 && overlayColor && (
        <div
          aria-hidden
          className={clsx('absolute inset-0 pointer-events-none', overlayClassName)}
          style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
        />
      )}
    </div>
  );
}


