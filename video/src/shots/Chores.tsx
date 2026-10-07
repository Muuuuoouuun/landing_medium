import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_IN, EASE_IO, EASE_OUT, ramp} from '../lib/anim';
import {getShot} from '../script';
import {color, font} from '../theme';

const Bar: React.FC<{label: string; width: number; tone: string; stripes?: boolean; labelIn: number}> = ({label, width, tone, stripes, labelIn}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{marginTop: 22, marginBottom: 34}}>
      <div
        style={{
          fontFamily: font.mono,
          fontSize: 26,
          fontWeight: 700,
          color: tone,
          letterSpacing: '0.04em',
          marginBottom: 12,
          opacity: labelIn,
          transform: `translateX(${(1 - labelIn) * -20}px)`,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 36,
          width,
          borderRadius: 18,
          background: stripes
            ? `repeating-linear-gradient(-45deg, ${tone} 0 18px, #EE7377 18px 36px)`
            : tone,
          backgroundPosition: `${frame * 3}px 0`,
          boxShadow: `0 10px 30px -10px ${tone}`,
        }}
      />
    </div>
  );
};

/** S02 — "가르치는 시간보다, 챙기는 시간이 더 길죠?" The chores bar runs off the screen. */
export const Chores: React.FC = () => {
  const shot = getShot('S02');
  const frame = useCurrentFrame();
  const teach = 470 * ramp(frame, 6, 22);
  const chores = interpolate(frame, [22, 60], [0, 2600], {...CLAMP, easing: EASE_IO});
  const pan = interpolate(frame, [36, 60], [0, -260], {...CLAMP, easing: EASE_IN});
  const exit = ramp(frame, 54, 60, EASE_IN);

  return (
    <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 190, transform: `translateX(${pan}px)`, opacity: 1 - exit * 0.4}}>
      <KineticLine segs={shot.lines[0]} start={0} size={104} weight={700} style={{color: color.inkSoft}} />
      <Bar label="가르치는 시간" width={teach} tone={color.green} labelIn={ramp(frame, 4, 12, EASE_OUT)} />
      <KineticLine segs={shot.lines[1]} start={17} size={128} fxStart={34} fxDuration={22} />
      <Bar label="챙기는 시간" width={chores} tone={color.red} stripes labelIn={ramp(frame, 20, 28, EASE_OUT)} />
    </AbsoluteFill>
  );
};
