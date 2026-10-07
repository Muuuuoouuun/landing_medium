import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE_IO, ramp} from '../lib/anim';
import type {Seg, Tone} from '../script';
import {AI_GRADIENT, color, font} from '../theme';

const toneColor: Record<Tone, string> = {
  ink: color.ink,
  red: color.red,
  green: color.green,
  ai: color.cyan,
  brand: color.greenDeep,
};

/** Per-character gradient slice, so a gradient reads as one continuous fill across split glyphs. */
export const gradientChar = (i: number, n: number, gradient = AI_GRADIENT): React.CSSProperties => ({
  backgroundImage: gradient,
  backgroundSize: `${Math.max(n, 1) * 100}% 100%`,
  backgroundPosition: `${n <= 1 ? 0 : (i / (n - 1)) * 100}% 0`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

/**
 * One line of kinetic type: characters rise in with a spring and de-blur, staggered.
 * Segments marked with `fx` act out their meaning once `fxStart` is reached.
 */
export const KineticLine: React.FC<{
  segs: Seg[];
  start?: number;
  size: number;
  weight?: number;
  stagger?: number;
  fxStart?: number;
  fxDuration?: number;
  style?: React.CSSProperties;
}> = ({segs, start = 0, size, weight = 800, stagger = 1, fxStart = Infinity, fxDuration = 14, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fxP = Number.isFinite(fxStart) ? ramp(frame, fxStart, fxStart + fxDuration, EASE_IO) : 0;
  let charIndex = 0;

  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.045em',
        lineHeight: 1.12,
        whiteSpace: 'nowrap',
        color: color.ink,
        ...style,
      }}
    >
      {segs.map((seg, s) => {
        const chars = [...seg.t];
        const tone = seg.tone ?? 'ink';
        const segStyle: React.CSSProperties = {display: 'inline-block', whiteSpace: 'pre'};
        if (seg.fx === 'stretch') {
          segStyle.transform = `scaleX(${1 + 0.32 * fxP})`;
          segStyle.transformOrigin = 'left center';
          segStyle.letterSpacing = `${-0.045 + 0.08 * fxP}em`;
        }
        return (
          <span key={s} style={segStyle}>
            {chars.map((ch, c) => {
              const i = charIndex++;
              const t = spring({frame: frame - start - i * stagger, fps, config: {damping: 19, stiffness: 210, mass: 0.6}});
              const reveal = interpolate(t, [0, 1], [0, 1], CLAMP);
              let fxTransform = '';
              let fxWeight: number | undefined;
              if (seg.fx === 'drop') {
                const q = interpolate(fxP * 1.6 - c * 0.12, [0, 1], [0, 1], CLAMP);
                fxTransform = ` translateY(${q * (0.16 + c * 0.05) * size}px) rotate(${(c % 2 ? 1 : -1) * q * 7}deg)`;
              }
              if (seg.fx === 'float') {
                const q = interpolate(fxP * 1.5 - c * 0.08, [0, 1], [0, 1], CLAMP);
                fxTransform = ` translateY(${-q * (0.1 + c * 0.035) * size}px)`;
                fxWeight = interpolate(q, [0, 1], [weight, 260]);
              }
              return (
                <span
                  key={c}
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'pre',
                    opacity: interpolate(reveal, [0, 0.6], [0, 1], CLAMP),
                    transform: `translateY(${(1 - reveal) * 0.42 * size}px)${fxTransform}`,
                    filter: reveal < 0.98 ? `blur(${(1 - reveal) * 14}px)` : undefined,
                    fontWeight: fxWeight,
                    ...(tone === 'ai' ? gradientChar(c, chars.length) : {color: toneColor[tone]}),
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
