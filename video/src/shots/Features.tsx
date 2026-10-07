import {Trail} from '@remotion/motion-blur';
import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FeatureFrame} from '../components/FeatureFrame';
import {CLAMP, EASE_IO, EASE_OUT, pop, ramp} from '../lib/anim';
import {Avatar, CheckBadge} from '../components/Bits';
import {getShot} from '../script';
import {color, font} from '../theme';

/* ───────────────────────── S05 자동 녹화 ───────────────────────── */

const PARABOLA = 'M 150 70 Q 370 600 590 70';
const AXES = 'M 70 330 L 670 330 M 370 40 L 370 380';

const RecordingUI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const seconds = Math.min(3600, 3598 + Math.floor(frame / 8));
  const ended = frame >= 17;
  const ts = `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const draw = ramp(frame, 0, 17, EASE_IO);
  const shutter = interpolate(frame, [17, 18, 23], [0, 0.9, 0], CLAMP);
  const toast = pop(frame, fps, 19, {damping: 15});

  return (
    <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column'}}>
      <div style={{height: 76, display: 'flex', alignItems: 'center', padding: '0 30px', gap: 14, borderBottom: `1px solid ${color.line}`}}>
        {ended ? (
          <span style={{fontFamily: font.sans, fontSize: 24, fontWeight: 700, color: color.inkSoft, background: '#EEF1EF', borderRadius: 12, padding: '6px 14px'}}>
            수업 종료
          </span>
        ) : (
          <>
            <span style={{width: 20, height: 20, borderRadius: 10, background: color.red, opacity: 0.55 + 0.45 * Math.abs(Math.sin(frame * 0.5))}} />
            <span style={{fontFamily: font.mono, fontSize: 24, fontWeight: 700, color: color.red}}>REC</span>
          </>
        )}
        <span style={{fontFamily: font.sans, fontSize: 24, fontWeight: 600, color: color.mute, marginLeft: 8}}>함수 1강</span>
        <span style={{marginLeft: 'auto', fontFamily: font.mono, fontSize: 26, fontWeight: 700, color: color.ink}}>{ts}</span>
      </div>
      <div
        style={{
          flex: 1,
          position: 'relative',
          background: '#FBFBF8',
          backgroundImage: 'linear-gradient(#EEF1EE 1px, transparent 1px), linear-gradient(90deg, #EEF1EE 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        <svg width={740} height={420} viewBox="0 0 740 420" style={{position: 'absolute', left: 10, top: 10}}>
          <path d={AXES} stroke={color.mute} strokeWidth={3} fill="none" {...evolvePath(ramp(frame, 0, 8), AXES)} />
          <path d={PARABOLA} stroke={color.green} strokeWidth={6} fill="none" strokeLinecap="round" {...evolvePath(draw, PARABOLA)} />
          <circle cx={370} cy={335} r={9} fill={color.red} opacity={ramp(frame, 12, 16)} />
        </svg>
        <div style={{position: 'absolute', left: 40, top: 26, fontFamily: font.mono, fontSize: 30, fontWeight: 700, color: color.inkSoft, opacity: ramp(frame, 2, 10)}}>
          y = x² − 4x + 3
        </div>
        <div style={{position: 'absolute', inset: 0, background: 'white', opacity: shutter}} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 30,
          right: 30,
          bottom: 28,
          padding: '20px 24px',
          borderRadius: 22,
          background: color.ink,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          transform: `translateY(${(1 - toast) * 140}px)`,
          opacity: Math.min(1, toast * 1.5),
        }}
      >
        <CheckBadge size={44} p={ramp(frame, 21, 28)} />
        <span style={{fontFamily: font.sans, fontSize: 30, fontWeight: 800, color: 'white'}}>녹화 완료</span>
        <span style={{fontFamily: font.sans, fontSize: 26, fontWeight: 500, color: '#A9B8B0'}}>바로 다시보기 가능</span>
      </div>
    </div>
  );
};

export const AutoRecord: React.FC = () => (
  <FeatureFrame shot={getShot('S05')}>
    <RecordingUI />
  </FeatureFrame>
);

/* ───────────────────────── S06 보강 관리 ───────────────────────── */

const FLIGHT = 'M 130 470 C 120 300, 330 120, 560 262';
const ROSTER = ['서연', '민준', '지호'];

const FlyingReplay: React.FC = () => {
  const frame = useCurrentFrame();
  const p = ramp(frame, 4, 20, EASE_IO);
  const len = getLength(FLIGHT);
  const pt = getPointAtLength(FLIGHT, len * p);
  if (!pt || frame > 21) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: pt.x,
        top: pt.y,
        width: 190,
        height: 112,
        marginLeft: -95,
        marginTop: -56,
        borderRadius: 16,
        background: `linear-gradient(135deg, ${color.greenDeep}, ${color.greenBright})`,
        boxShadow: '0 20px 40px -14px rgba(13,110,75,0.6)',
        transform: `scale(${interpolate(p, [0, 0.85, 1], [1, 0.8, 0.35])}) rotate(${interpolate(p, [0, 0.5, 1], [-8, 6, 0])}deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={20} cy={20} r={20} fill="rgba(255,255,255,0.25)" />
        <path d="M16 12l12 8-12 8z" fill="white" />
      </svg>
      <span style={{position: 'absolute', bottom: 8, left: 12, fontFamily: font.sans, fontSize: 16, fontWeight: 700, color: 'white'}}>오늘 수업 영상</span>
    </div>
  );
};

const MakeupUI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flip = ramp(frame, 20, 28, EASE_OUT);
  const burst = ramp(frame, 20, 32);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{padding: '30px 34px 0', fontFamily: font.sans, fontSize: 26, fontWeight: 700, color: color.mute}}>오늘 출석 · 함수 1강</div>
      {ROSTER.map((name, i) => {
        const absent = name === '민준';
        const rowIn = pop(frame, fps, 1 + i * 2.5, {damping: 18});
        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              left: 34,
              right: 34,
              top: 100 + i * 120,
              height: 96,
              borderRadius: 20,
              background: absent ? '#FFF7F7' : '#F7F9F8',
              border: `1px solid ${absent ? '#F6D4D5' : color.line}`,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '0 22px',
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * 30}px)`,
            }}
          >
            <Avatar name={name} i={i} />
            <span style={{fontFamily: font.sans, fontSize: 32, fontWeight: 700, color: color.ink}}>{name}</span>
            <span style={{marginLeft: 'auto', perspective: 400, display: 'inline-block'}}>
              {absent ? (
                <span
                  style={{
                    display: 'inline-block',
                    padding: '8px 18px',
                    borderRadius: 14,
                    fontFamily: font.sans,
                    fontSize: 24,
                    fontWeight: 800,
                    color: 'white',
                    background: flip < 0.5 ? color.red : color.greenBright,
                    transform: `rotateX(${flip < 0.5 ? flip * 180 : (flip - 1) * 180}deg)`,
                  }}
                >
                  {flip < 0.5 ? '결석' : '보강 완료 ✓'}
                </span>
              ) : (
                <span style={{fontFamily: font.sans, fontSize: 24, fontWeight: 700, color: color.green}}>출석</span>
              )}
            </span>
          </div>
        );
      })}
      <svg width={760} height={560} style={{position: 'absolute', inset: 0}}>
        <defs>
          <mask id="flight-mask">
            <path d={FLIGHT} stroke="white" strokeWidth={14} fill="none" {...evolvePath(ramp(frame, 2, 19, EASE_IO), FLIGHT)} />
          </mask>
        </defs>
        <path
          d={FLIGHT}
          stroke={color.greenBright}
          strokeWidth={5}
          strokeDasharray="2 14"
          strokeLinecap="round"
          fill="none"
          mask="url(#flight-mask)"
          opacity={interpolate(frame, [2, 6, 22, 30], [0, 1, 1, 0], CLAMP)}
        />
        <circle cx={630} cy={268} r={40 + burst * 70} fill="none" stroke={color.greenBright} strokeWidth={4} opacity={frame >= 20 ? 1 - burst : 0} />
      </svg>
      <Trail layers={5} lagInFrames={0.7} trailOpacity={0.45}>
        <FlyingReplay />
      </Trail>
    </div>
  );
};

export const Makeup: React.FC = () => (
  <FeatureFrame shot={getShot('S06')}>
    <MakeupUI />
  </FeatureFrame>
);

/* ───────────────────────── S07 상세한 관리 ───────────────────────── */

const RECORDS = [
  {name: '민준', hw: 92, part: 80, und: 88},
  {name: '서연', hw: 100, part: 95, und: 94},
  {name: '지호', hw: 75, part: 70, und: 81},
  {name: '하은', hw: 88, part: 90, und: 90},
  {name: '도윤', hw: 64, part: 85, und: 77},
];

const MiniBar: React.FC<{value: number; tint: string}> = ({value, tint}) => (
  <span style={{display: 'inline-block', width: 130, height: 14, borderRadius: 7, background: '#EDF1EE', overflow: 'hidden'}}>
    <span style={{display: 'block', width: `${value}%`, height: '100%', borderRadius: 7, background: tint}} />
  </span>
);

const RecordsUI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cols = '150px 70px 150px 150px 1fr';
  return (
    <div style={{position: 'absolute', inset: 0, padding: '28px 30px'}}>
      <div style={{display: 'grid', gridTemplateColumns: cols, gap: 12, fontFamily: font.sans, fontSize: 21, fontWeight: 700, color: color.mute, padding: '0 14px 14px'}}>
        <span>이름</span>
        <span>출석</span>
        <span>과제</span>
        <span>참여</span>
        <span style={{textAlign: 'right'}}>이해도</span>
      </div>
      {RECORDS.map((r, i) => {
        const rowIn = pop(frame, fps, 1 + i * 2, {damping: 17});
        const fill = ramp(frame, 6 + i * 2, 22 + i * 2, EASE_IO);
        return (
          <div
            key={r.name}
            style={{
              display: 'grid',
              gridTemplateColumns: cols,
              gap: 12,
              alignItems: 'center',
              height: 84,
              padding: '0 14px',
              marginBottom: 6,
              borderRadius: 16,
              background: i % 2 === 0 ? '#F7F9F8' : 'transparent',
              opacity: rowIn,
              transform: `translateY(${(1 - rowIn) * 50}px)`,
            }}
          >
            <span style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Avatar name={r.name} i={i} size={44} />
              <span style={{fontFamily: font.sans, fontSize: 26, fontWeight: 700, color: color.ink}}>{r.name}</span>
            </span>
            <CheckBadge size={30} p={ramp(frame, 5 + i * 2, 12 + i * 2)} />
            <MiniBar value={r.hw * fill} tint={color.greenBright} />
            <MiniBar value={r.part * fill} tint={color.cyan} />
            <span style={{textAlign: 'right', fontFamily: font.mono, fontSize: 30, fontWeight: 700, color: color.ink}}>
              {Math.round(r.und * fill)}
              <span style={{fontSize: 20, color: color.mute}}>%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const Records: React.FC = () => (
  <FeatureFrame shot={getShot('S07')}>
    <RecordsUI />
  </FeatureFrame>
);
