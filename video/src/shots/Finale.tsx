import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticLine} from '../components/KineticLine';
import {Clock} from '../components/Roll';
import {CLAMP, EASE_IO, EASE_OUT, pop, ramp} from '../lib/anim';
import {getShot} from '../script';
import {color, font} from '../theme';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** Warm light leak drifting across the end card. */
const LightLeak: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0) return null;
  const o = interpolate(t, [0, 10, 40], [0, 1, 0.7], CLAMP);
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity: o,
        background: `radial-gradient(ellipse 60% 70% at ${-10 + t * 1.4}% 30%, rgba(255,190,120,0.30), transparent 70%),
          radial-gradient(ellipse 50% 60% at ${110 - t * 1.1}% 80%, rgba(110,231,183,0.32), transparent 70%)`,
      }}
    />
  );
};

/**
 * S12 + S13 in one continuous shot: the clock rewinds to 22:00 for the callback line,
 * then the line lifts and the ClassIn end card lands under it.
 */
export const Finale: React.FC = () => {
  const callback = getShot('S12');
  const endCard = getShot('S13');
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const END = endCard.from - callback.from; // local frame where S13 begins

  // Rewind from where the opening clock stopped (23:58) back to 22:00.
  const target = toMinutes(callback.clock ?? '22:00');
  const rewind = (f: number) => interpolate(f, [0, 16], [toMinutes('23:58'), target], {...CLAMP, easing: EASE_OUT});

  const lift = ramp(frame, END - 6, END + 8, EASE_IO);
  const logo = ramp(frame, END, END + 11);
  const sweep = interpolate(frame, [END + 8, END + 28], [120, -20], CLAMP);
  const sub = ramp(frame, END + 8, END + 18);
  const cta = pop(frame, fps, END + 12, {damping: 12, stiffness: 200});

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: `translateY(${-lift * 330}px) scale(${1 - lift * 0.42})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18}}>
          <span style={{fontFamily: font.mono, fontSize: 30, fontWeight: 700, color: color.mute, letterSpacing: '0.1em'}}>PM</span>
          <Clock id="clock-end" minutes={rewind(frame)} velocity={rewind(frame) - rewind(frame - 1)} size={128} tint={color.ink} />
        </div>
        <KineticLine segs={callback.lines[0]} start={8} size={116} />
        <KineticLine segs={callback.lines[1]} start={17} size={116} />
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 230}}>
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 230,
            fontWeight: 900,
            letterSpacing: '-0.055em',
            lineHeight: 1.05,
            clipPath: `inset(-10% ${(1 - logo) * 100}% -10% 0)`,
            transform: `scale(${1.12 - 0.12 * logo})`,
            backgroundImage: `linear-gradient(100deg, ${color.greenDeep} 0%, ${color.greenDeep} 42%, #7CF0C4 50%, ${color.greenDeep} 58%, ${color.greenDeep} 100%)`,
            backgroundSize: '300% 100%',
            backgroundPosition: `${sweep}% 0`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {endCard.lines[0][0].t}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: font.sans,
            fontSize: 44,
            fontWeight: 600,
            color: color.inkSoft,
            letterSpacing: '-0.02em',
            opacity: sub,
            transform: `translateY(${(1 - sub) * 20}px)`,
          }}
        >
          {endCard.sub}
        </div>
        <div
          style={{
            marginTop: 40,
            padding: '22px 46px',
            borderRadius: 48,
            background: color.ink,
            color: color.white,
            fontFamily: font.sans,
            fontSize: 36,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: '0 24px 50px -20px rgba(11,20,16,0.6)',
            opacity: Math.min(1, cta * 1.5),
            transform: `scale(${0.6 + 0.4 * cta})`,
          }}
        >
          {endCard.cta}
          <span style={{color: color.greenBright, fontSize: 40}}>→</span>
        </div>
      </AbsoluteFill>
      <LightLeak start={END} />
    </AbsoluteFill>
  );
};
