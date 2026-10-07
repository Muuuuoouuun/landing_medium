import {noise2D} from '@remotion/noise';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Clock} from '../components/Roll';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_OUT, pop, ramp} from '../lib/anim';
import {getShot} from '../script';
import {CHORES, CHORE_GAP, CHORE_START} from './chores-data';
import {color, font} from '../theme';



const ChoreChip: React.FC<{chip: (typeof CHORES)[number]; at: number; i: number}> = ({chip, at, i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, {damping: 11, stiffness: 240});
  if (frame < at) return null;
  const driftY = noise2D(`chip${i}`, frame * 0.05, 0) * 8 - (frame - at) * 0.6;
  return (
    <div
      style={{
        position: 'absolute',
        left: chip.x,
        top: chip.y,
        transform: `translate(-50%, -50%) translateY(${(1 - p) * 40 + driftY}px) rotate(${chip.r}deg) scale(${0.55 + 0.45 * p})`,
        opacity: Math.min(1, p * 1.4),
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '18px 26px',
        borderRadius: 20,
        background: color.white,
        border: `1px solid ${color.line}`,
        boxShadow: '0 24px 50px -20px rgba(11,40,28,0.35)',
        fontFamily: font.sans,
        fontSize: 30,
        fontWeight: 650,
        color: color.inkSoft,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: 14, height: 14, borderRadius: 7, background: chip.urgent ? color.red : '#F5A524'}} />
      {chip.text}
      <span style={{fontFamily: font.mono, fontSize: 20, color: color.mute, marginLeft: 6}}>지금</span>
    </div>
  );
};

/** S01 — 23:40. "수업은 끝났는데, 하루가 끝나지 않으시죠?" Chores pile up while the clock slips. */
export const Night: React.FC = () => {
  const shot = getShot('S01');
  const frame = useCurrentFrame();
  const [hh, mm] = (shot.clock ?? '23:40').split(':').map(Number);

  // Clock rolls in, then time starts slipping once the chores arrive.
  const slip = interpolate(frame, [30, 60], [0, 18], {...CLAMP, easing: Easing.in(Easing.quad)});
  const slipPrev = interpolate(frame - 1, [30, 60], [0, 18], {...CLAMP, easing: Easing.in(Easing.quad)});
  const spin = 1 - ramp(frame, 0, 20, EASE_OUT);
  const spinPrev = 1 - ramp(frame - 1, 0, 20, EASE_OUT);

  const push = interpolate(frame, [0, 60], [1, 1.08]);
  const shake = interpolate(frame, [34, 58], [0, 8], CLAMP);
  const sx = noise2D('n1x', frame * 0.4, 0) * shake;
  const sy = noise2D('n1y', 0, frame * 0.4) * shake;

  return (
    <AbsoluteFill style={{transform: `translate(${sx}px, ${sy}px) scale(${push})`}}>
      {CHORES.map((chip, i) => (
        <ChoreChip key={chip.text} chip={chip} at={CHORE_START + i * CHORE_GAP} i={i} />
      ))}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 6}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18}}>
          <span style={{fontFamily: font.mono, fontSize: 30, fontWeight: 700, color: color.mute, letterSpacing: '0.1em'}}>PM</span>
          <Clock
            id="clock-open"
            minutes={hh * 60 + mm + slip}
            velocity={slip - slipPrev}
            spin={spin}
            spinVelocity={spin - spinPrev}
            size={128}
            colonOn={Math.floor(frame / 10) % 2 === 0}
            tint={color.ink}
          />
        </div>
        <KineticLine segs={shot.lines[0]} start={6} size={116} />
        <KineticLine segs={shot.lines[1]} start={24} size={116} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
