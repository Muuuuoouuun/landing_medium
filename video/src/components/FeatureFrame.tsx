import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CLAMP, EASE_IN, EASE_OUT, pop, ramp} from '../lib/anim';
import type {Shot} from '../script';
import {cardStyle, color, font} from '../theme';
import {DirBlur} from './DirBlur';
import {KineticLine} from './KineticLine';

/** Horizontal whip: slides in from the right, out to the left. Returns x offset for a frame. */
const whipX = (f: number, dur: number, distance: number) => {
  const inX = interpolate(f, [0, 8], [distance, 0], {...CLAMP, easing: EASE_OUT});
  const outX = interpolate(f, [dur - 6, dur], [0, -distance], {...CLAMP, easing: EASE_IN});
  return inX + outX;
};

export const FeatureChip: React.FC<{shot: Shot; appear: number}> = ({shot, appear}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 24px 12px 14px',
      borderRadius: 40,
      background: color.white,
      border: `1px solid ${color.line}`,
      boxShadow: '0 14px 30px -18px rgba(11,40,28,0.4)',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 16}px)`,
    }}
  >
    {shot.index ? (
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 22,
          fontWeight: 700,
          color: color.white,
          background: color.green,
          borderRadius: 20,
          padding: '4px 12px',
        }}
      >
        {shot.index}
      </span>
    ) : null}
    <span style={{fontFamily: font.sans, fontSize: 30, fontWeight: 700, color: color.greenDeep}}>{shot.label}</span>
  </div>
);

/**
 * Shared layout for ACT 3 cards: chip + two-line copy on the left, a live UI card on the right.
 * Consecutive cards whip horizontally into each other; the UI card travels further for parallax.
 */
export const FeatureFrame: React.FC<{shot: Shot; children: React.ReactNode; uiWidth?: number; uiHeight?: number}> = ({
  shot,
  children,
  uiWidth = 760,
  uiHeight = 560,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const textX = whipX(frame, durationInFrames, 380);
  const uiX = whipX(frame, durationInFrames, 620);
  const textV = Math.abs(textX - whipX(frame - 1, durationInFrames, 380));
  const uiV = Math.abs(uiX - whipX(frame - 1, durationInFrames, 620));
  const uiIn = pop(frame, fps, 2, {damping: 16});

  return (
    <AbsoluteFill>
      {/* Giant outline index numeral in the background for depth. */}
      {shot.index ? (
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: 40,
            fontFamily: font.mono,
            fontWeight: 700,
            fontSize: 520,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `2px rgba(15,138,94,0.16)`,
            transform: `translateX(${textX * 0.5}px)`,
          }}
        >
          {shot.index}
        </div>
      ) : null}
      <DirBlur
        id={`fx-text-${shot.id}`}
        x={Math.min(textV * 0.5, 40)}
        style={{position: 'absolute', left: 160, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', transform: `translateX(${textX}px)`}}
      >
        <div style={{marginBottom: 34}}>
          <FeatureChip shot={shot} appear={ramp(frame, 1, 8)} />
        </div>
        {shot.lines.map((line, i) => (
          <KineticLine key={i} segs={line} start={3 + i * 5} size={112} />
        ))}
      </DirBlur>
      <DirBlur
        id={`fx-ui-${shot.id}`}
        x={Math.min(uiV * 0.5, 50)}
        style={{
          position: 'absolute',
          right: 130,
          top: '50%',
          width: uiWidth,
          height: uiHeight,
          marginTop: -uiHeight / 2,
          transform: `perspective(1800px) translateX(${uiX}px) rotateY(-9deg) scale(${0.9 + 0.1 * uiIn})`,
        }}
      >
        <div style={{...cardStyle, width: uiWidth, height: uiHeight, overflow: 'hidden', position: 'relative'}}>{children}</div>
      </DirBlur>
    </AbsoluteFill>
  );
};
