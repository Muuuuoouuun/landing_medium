import {noise2D} from '@remotion/noise';
import {evolvePath} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckBadge} from '../components/Bits';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_IN, EASE_IO, EASE_OUT, pop, ramp} from '../lib/anim';
import {getShot} from '../script';
import {AI_GRADIENT, cardStyle, color, font} from '../theme';

const BARS = 64;
const WAVE_W = 860;
const RADAR_R = 170;
const RADAR_AXES = ['설명', '질문', '참여', '속도', '집중'];
const RADAR_VALUES = [0.86, 0.68, 0.92, 0.64, 0.8];

const radarPoint = (i: number, r: number) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / RADAR_AXES.length;
  return [Math.cos(a) * r, Math.sin(a) * r] as const;
};
const polygon = (values: number[]) =>
  values.map((v, i) => radarPoint(i, v * RADAR_R)).map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z';

const HudTag: React.FC<{text: string; at: number; x: number; y: number}> = ({text, at, x, y}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, {damping: 13, stiffness: 260});
  if (frame < at) return null;
  const typed = Math.round(interpolate(frame, [at, at + 6], [0, text.length], CLAMP));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `scale(${0.7 + 0.3 * p})`,
        transformOrigin: 'left center',
        opacity: Math.min(1, p * 1.4),
        padding: '10px 18px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.92)',
        border: `1.5px solid ${color.cyan}`,
        boxShadow: '0 16px 30px -16px rgba(14,165,198,0.6)',
        fontFamily: font.sans,
        fontSize: 24,
        fontWeight: 700,
        color: color.ink,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{display: 'inline-block', width: 10, height: 10, borderRadius: 5, background: color.cyan, marginRight: 10, verticalAlign: 'middle'}} />
      {text.slice(0, typed)}
    </div>
  );
};

const AISlam: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const land = spring({frame, fps, config: {damping: 12, stiffness: 300, mass: 0.6}});
  const split = (1 - ramp(frame, 0, 8)) * 26;
  const leave = ramp(frame, 9, 15, EASE_IN);
  const shake = interpolate(frame, [0, 8], [14, 0], CLAMP);
  const sx = noise2D('ai-x', frame * 0.9, 0) * shake;
  const sy = noise2D('ai-y', 0, frame * 0.9) * shake;
  if (leave >= 1) return null;

  const word: React.CSSProperties = {
    position: 'absolute',
    fontFamily: font.sans,
    fontSize: 560,
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  };

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${sx}px, ${sy - leave * 360}px) scale(${(1.5 - 0.5 * land) * (1 - leave * 0.8)})`,
        opacity: 1 - leave,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 2400,
          height: 2400,
          background: `repeating-conic-gradient(from ${frame * 2}deg, rgba(14,165,198,0.13) 0deg 5deg, transparent 5deg 15deg)`,
          maskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
          opacity: 1 - ramp(frame, 4, 14),
        }}
      />
      <div style={{...word, color: '#22D3EE', transform: `translateX(${-split}px)`, opacity: 0.7, mixBlendMode: 'multiply'}}>AI</div>
      <div style={{...word, color: '#F0509A', transform: `translateX(${split}px)`, opacity: 0.55, mixBlendMode: 'multiply'}}>AI</div>
      <div style={{...word, backgroundImage: AI_GRADIENT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>AI</div>
    </AbsoluteFill>
  );
};

/** S09 — "AI" slams in on the drop, then the lecture is scanned and scored. */
export const AIEval: React.FC = () => {
  const shot = getShot('S09');
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panelIn = pop(frame, fps, 11, {damping: 17, stiffness: 160});
  const scan = interpolate(frame, [15, 38], [0, WAVE_W], {...CLAMP, easing: EASE_IO});
  const radar = ramp(frame, 18, 34, EASE_IO);
  const focusBand = ramp(frame, 28, 34);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 92}}>
        <KineticLine segs={shot.lines[0]} start={10} size={96} />
      </AbsoluteFill>

      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: 170,
          right: 170,
          top: 300,
          height: 640,
          transform: `translateY(${(1 - panelIn) * 160}px) scale(${0.94 + 0.06 * panelIn})`,
          opacity: Math.min(1, panelIn * 1.3),
          overflow: 'hidden',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, padding: '28px 40px', borderBottom: `1px solid ${color.line}`}}>
          <span
            style={{
              fontFamily: font.sans,
              fontSize: 28,
              fontWeight: 800,
              backgroundImage: AI_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {shot.label} 리포트
          </span>
          <span style={{fontFamily: font.sans, fontSize: 24, fontWeight: 600, color: color.mute}}>함수 1강 · 50분</span>
          <span
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: font.sans,
              fontSize: 24,
              fontWeight: 700,
              color: color.green,
              opacity: ramp(frame, 36, 40),
            }}
          >
            <CheckBadge size={30} p={ramp(frame, 36, 42)} /> 분석 완료
          </span>
        </div>

        {/* Lecture waveform with a scan line. */}
        <div style={{position: 'absolute', left: 40, top: 130, width: WAVE_W, height: 380}}>
          <div
            style={{
              position: 'absolute',
              left: (WAVE_W * 18) / 50,
              width: (WAVE_W * 6) / 50,
              top: 30,
              bottom: 40,
              borderRadius: 16,
              background: 'rgba(16,185,129,0.12)',
              border: `2px dashed ${color.greenBright}`,
              opacity: focusBand,
            }}
          />
          {Array.from({length: BARS}).map((_, i) => {
            const x = (i / BARS) * WAVE_W;
            const h = (0.18 + 0.82 * Math.abs(noise2D('wave', i * 0.18, frame * 0.04))) * 250;
            const done = x < scan;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: 170 - h / 2,
                  width: WAVE_W / BARS - 5,
                  height: h,
                  borderRadius: 6,
                  background: done ? `hsl(${interpolate(i, [0, BARS], [158, 200])}, 75%, 45%)` : '#D5DCD8',
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: scan - 140,
              width: 140,
              top: -10,
              bottom: 30,
              background: 'linear-gradient(90deg, transparent, rgba(14,165,198,0.18))',
              opacity: scan > 0 && scan < WAVE_W ? 1 : 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: scan,
              width: 4,
              top: -10,
              bottom: 30,
              borderRadius: 2,
              background: color.cyan,
              boxShadow: `0 0 24px 4px rgba(14,165,198,0.6)`,
              opacity: scan > 0 && scan < WAVE_W ? 1 : 0,
            }}
          />
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'space-between', fontFamily: font.mono, fontSize: 20, color: color.mute}}>
            {['00:00', '10:00', '20:00', '30:00', '40:00', '50:00'].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        <HudTag text="발화 비율  선생님 6 : 학생 4" at={18} x={60} y={112} />
        <HudTag text="질문 12회" at={22} x={560} y={150} />
        <HudTag text="집중 구간 18–24분" at={28} x={(WAVE_W * 18) / 50 + 40} y={528} />

        {/* Radar chart. */}
        <svg width={460} height={460} viewBox="-230 -230 460 460" style={{position: 'absolute', right: 40, top: 140}}>
          {[0.5, 1].map((lvl) => (
            <path key={lvl} d={polygon(RADAR_AXES.map(() => lvl))} fill="none" stroke={color.line} strokeWidth={2} />
          ))}
          {RADAR_AXES.map((label, i) => {
            const [x, y] = radarPoint(i, RADAR_R);
            const [lx, ly] = radarPoint(i, RADAR_R + 34);
            return (
              <g key={label}>
                <line x1={0} y1={0} x2={x} y2={y} stroke={color.line} strokeWidth={2} />
                <text x={lx} y={ly + 8} textAnchor="middle" fontFamily="Pretendard" fontSize={22} fontWeight={700} fill={color.inkSoft}>
                  {label}
                </text>
              </g>
            );
          })}
          <defs>
            <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={color.greenBright} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color.blue} stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <path d={polygon(RADAR_VALUES.map((v) => v * (0.6 + 0.4 * radar)))} fill="url(#radar-fill)" opacity={ramp(frame, 26, 36)} />
          <path
            d={polygon(RADAR_VALUES)}
            fill="none"
            stroke={color.cyan}
            strokeWidth={5}
            strokeLinejoin="round"
            {...evolvePath(radar, polygon(RADAR_VALUES))}
          />
          {RADAR_VALUES.map((v, i) => {
            const [x, y] = radarPoint(i, v * RADAR_R);
            return <circle key={i} cx={x} cy={y} r={8} fill={color.white} stroke={color.cyan} strokeWidth={4} opacity={ramp(frame, 20 + i * 3, 24 + i * 3, EASE_OUT)} />;
          })}
        </svg>
      </div>

      <AISlam />
    </AbsoluteFill>
  );
};
