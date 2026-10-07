import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Reel} from '../components/Roll';
import {CLAMP, EASE_IN, EASE_OUT, ramp} from '../lib/anim';
import {getShot} from '../script';
import {color, font} from '../theme';

/** S04 — "회의용 툴" rolls into "교육용 툴, ClassIn." First big hit; the whole film warms up here. */
export const EduTool: React.FC = () => {
  const shot = getShot('S04');
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const HIT = shot.hit ?? 18;
  const [slotSeg, restSeg, brandSeg, tailSeg] = shot.lines[0];
  const size = 150;

  // Strike through the old word, then roll: 회의 → 화상 → 채팅 → 교육.
  const strike = ramp(frame, 0, 7);
  const strip = [slotSeg.from ?? '회의', '화상', '채팅', slotSeg.t];
  const rollSpring = (f: number) => spring({frame: f - 6, fps, config: {damping: 14, stiffness: 105, mass: 0.85}});
  const roll = rollSpring(frame) * (strip.length - 1);
  const rollVel = roll - rollSpring(frame - 1) * (strip.length - 1);

  const punch = interpolate(frame, [HIT - 1, HIT, HIT + 12], [1, 1.07, 1], CLAMP);
  const ring = ramp(frame, HIT, HIT + 16);
  const wipe = ramp(frame, HIT + 2, HIT + 14);
  const sweep = interpolate(frame, [HIT + 8, HIT + 20], [120, -20], CLAMP);
  const exit = ramp(frame, 35, 40, EASE_IN);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: 200,
          border: `6px solid ${color.greenBright}`,
          transform: `scale(${ring * 5})`,
          opacity: frame >= HIT ? (1 - ring) * 0.7 : 0,
        }}
      />
      <div
        style={{
          fontFamily: font.sans,
          fontSize: size,
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: color.ink,
          display: 'flex',
          alignItems: 'flex-end',
          whiteSpace: 'pre',
          transform: `scale(${punch * (1 + exit * 0.08)})`,
          filter: exit > 0 ? `blur(${exit * 16}px)` : undefined,
          opacity: 1 - exit,
        }}
      >
        <span style={{position: 'relative', display: 'inline-block'}}>
          <Reel
            id="edu-slot"
            items={strip}
            value={roll}
            velocity={rollVel}
            height={size * 1.18}
            width={size * 1.8}
            itemStyle={(i) => ({color: i === strip.length - 1 ? color.green : i === 0 ? color.red : color.mute})}
          />
          <span
            style={{
              position: 'absolute',
              left: '4%',
              top: '54%',
              height: 12,
              width: `${strike * 92}%`,
              borderRadius: 6,
              background: color.red,
              opacity: interpolate(roll, [0, 0.5], [1, 0], CLAMP),
            }}
          />
        </span>
        <span style={{lineHeight: `${size * 1.18}px`}}>{restSeg.t}</span>
        <span
          style={{
            display: 'inline-block',
            overflow: 'hidden',
            maxWidth: `${wipe * 4.6}em`,
            lineHeight: `${size * 1.18}px`,
            backgroundImage: `linear-gradient(100deg, ${color.greenDeep} 0%, ${color.greenDeep} 42%, #7CF0C4 50%, ${color.greenDeep} 58%, ${color.greenDeep} 100%)`,
            backgroundSize: '300% 100%',
            backgroundPosition: `${sweep}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {brandSeg.t}
        </span>
        <span style={{lineHeight: `${size * 1.18}px`, color: color.greenBright, opacity: ramp(frame, HIT + 10, HIT + 14, EASE_OUT), maxWidth: `${ramp(frame, HIT + 10, HIT + 14) * 0.4}em`, overflow: 'hidden', display: 'inline-block'}}>{tailSeg.t}</span>
      </div>
    </AbsoluteFill>
  );
};
