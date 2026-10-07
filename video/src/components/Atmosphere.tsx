import {noise2D} from '@remotion/noise';
import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useCurrentFrame} from 'remotion';
import {CLAMP} from '../lib/anim';
import {getShot} from '../script';
import {color} from '../theme';

/** Global light-theme backdrop: paper, drifting dot grid and soft color fields that warm up after the turn. */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const turn = getShot('S04');
  const aiStart = getShot('S09');
  const aiEnd = getShot('S11');
  const brandHit = turn.from + (turn.hit ?? 0);
  const aiOut = aiEnd.from + aiEnd.durationInFrames;
  // 0 = tired cool grey (before ClassIn), 1 = bright warm paper (after the S04 hit).
  const warm = interpolate(frame, [brandHit - 14, brandHit + 10], [0, 1], CLAMP);
  // AI act leans the color fields toward cyan/blue.
  const ai = interpolate(frame, [aiStart.from - 6, aiStart.from + 8, aiOut - 10, aiOut + 12], [0, 1, 1, 0], CLAMP);

  const paper = interpolateColors(warm, [0, 1], [color.paperCool, color.paper]);
  const fieldA = interpolateColors(ai, [0, 1], [interpolateColors(warm, [0, 1], ['#CDD5D1', '#C3F2DD']), '#C6EEF7']);
  const fieldB = interpolateColors(ai, [0, 1], [interpolateColors(warm, [0, 1], ['#D6DBD8', '#E3F7D9']), '#D9E2FF']);

  const drift = (seed: string, amp: number) => noise2D(seed, frame * 0.006, 0) * amp;

  return (
    <AbsoluteFill style={{background: paper}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + drift('ax', 14)}% ${28 + drift('ay', 12)}%, ${fieldA} 0%, transparent 46%),
            radial-gradient(circle at ${74 + drift('bx', 14)}% ${72 + drift('by', 12)}%, ${fieldB} 0%, transparent 50%)`,
          opacity: 0.9,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(11,20,16,0.13) 1.3px, transparent 1.7px)',
          backgroundSize: '44px 44px',
          backgroundPosition: `${-frame * 0.4}px ${-frame * 0.25}px`,
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
          opacity: 0.6,
        }}
      />
    </AbsoluteFill>
  );
};

/** Film grain + soft vignette on top of everything. */
export const FilmFinish: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(24,36,30,0.13) 100%)'}} />
      <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.22}}>
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Full-frame flash used on the big hits. */
export const Flash: React.FC<{at: number; peak?: number; hold?: number; tint?: string}> = ({at, peak = 0.85, hold = 2, tint = '#FFFFFF'}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 3, at, at + hold, at + hold + 7], [0, peak, peak, 0], CLAMP);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: tint, opacity: o, pointerEvents: 'none'}} />;
};
