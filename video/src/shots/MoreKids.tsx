import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {FeatureChip} from '../components/FeatureFrame';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_IO, EASE_OUT, ramp} from '../lib/anim';
import {getShot} from '../script';
import {color} from '../theme';

const COLS = 31;
const ROWS = 19;
const PITCH = 68;
const TILE = 58;
const FOCUS = {x: 1310, y: 540};
const START_SCALE = 9;

const PASTELS = [
  ['#D1FAE5', '#6EE7B7'],
  ['#E0F2FE', '#7DD3FC'],
  ['#FEF3C7', '#FCD34D'],
  ['#FCE7F3', '#F9A8D4'],
  ['#EDE9FE', '#C4B5FD'],
  ['#ECFDF5', '#A7F3D0'],
];

const Kid: React.FC<{x: number; y: number; palette: string[]; appear: number; hero: boolean}> = ({x, y, palette, appear, hero}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: TILE,
      height: TILE,
      borderRadius: 14,
      background: hero ? color.white : palette[0],
      border: hero ? `3px solid ${color.greenBright}` : undefined,
      overflow: 'hidden',
      transform: `scale(${0.3 + 0.7 * appear})`,
      opacity: appear,
    }}
  >
    <div style={{position: 'absolute', left: 19, top: 10, width: 20, height: 20, borderRadius: 10, background: hero ? color.green : palette[1]}} />
    <div style={{position: 'absolute', left: 11, top: 34, width: 36, height: 30, borderRadius: '18px 18px 0 0', background: hero ? color.green : palette[1]}} />
  </div>
);

/** S08 — "더 많은 아이들을 만났다." One student tile pulls back into hundreds. */
export const MoreKids: React.FC = () => {
  const shot = getShot('S08');
  const frame = useCurrentFrame();

  const logScale = interpolate(frame, [0, 27], [Math.log(START_SCALE), 0], {...CLAMP, easing: EASE_IO});
  const scale = Math.exp(logScale);
  // How many rings around the hero tile are on screen at this zoom.
  const reach = 1350 / (PITCH * scale) + 0.6;

  const kids = useMemo(
    () =>
      Array.from({length: COLS * ROWS}).map((_, i) => {
        const cx = (i % COLS) - (COLS - 1) / 2;
        const cy = Math.floor(i / COLS) - (ROWS - 1) / 2;
        return {i, cx, cy, ring: Math.max(Math.abs(cx), Math.abs(cy)), palette: PASTELS[Math.floor(random(`kid${i}`) * PASTELS.length)]};
      }),
    [],
  );

  const textIn = interpolate(frame, [0, 8], [380, 0], {...CLAMP, easing: EASE_OUT});

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: FOCUS.x, top: FOCUS.y, transform: `scale(${scale})`}}>
        {kids.map((k) => (
          <Kid
            key={k.i}
            x={k.cx * PITCH - TILE / 2}
            y={k.cy * PITCH - TILE / 2}
            palette={k.palette}
            hero={k.ring === 0}
            appear={k.ring === 0 ? 1 : interpolate(reach - k.ring, [0, 1.2], [0, 1], CLAMP)}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: '50%',
          transform: `translate(${textIn}px, -50%)`,
          padding: '46px 60px 54px',
          borderRadius: 40,
          background: 'rgba(247,248,244,0.86)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 40px 80px -40px rgba(11,40,28,0.35)',
        }}
      >
        <div style={{marginBottom: 30}}>
          <FeatureChip shot={shot} appear={ramp(frame, 1, 8)} />
        </div>
        {shot.lines.map((line, i) => (
          <KineticLine key={i} segs={line} start={3 + i * 5} size={112} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
