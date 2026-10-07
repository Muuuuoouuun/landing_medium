import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FeatureFrame} from '../components/FeatureFrame';
import {Reel} from '../components/Roll';
import {gradientChar} from '../components/KineticLine';
import {ramp} from '../lib/anim';
import {getShot} from '../script';
import {AI_GRADIENT, color, font} from '../theme';

const VERSIONS = ['1.0', '2.0', '3.0'];
const STEPS = [3, 11, 19];
const GROWTH = 'M 40 470 C 170 450, 230 380, 320 330 S 470 230, 540 170 S 650 60, 720 40';

const UpgradeUI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const stepAt = (f: number) => STEPS.slice(1).reduce((sum, at) => sum + spring({frame: f - at, fps, config: {damping: 14, stiffness: 170, mass: 0.7}}), 0);
  const value = stepAt(frame);
  const velocity = value - stepAt(frame - 1);
  const level = Math.round(value);
  const grow = ramp(frame, 2, 26);
  const tip = getPointAtLength(GROWTH, getLength(GROWTH) * grow);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <svg width={760} height={560} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="growth" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={color.greenBright} />
            <stop offset="60%" stopColor={color.cyan} />
            <stop offset="100%" stopColor={color.blue} />
          </linearGradient>
        </defs>
        {[140, 260, 380].map((y) => (
          <line key={y} x1={40} x2={720} y1={y} y2={y} stroke={color.line} strokeWidth={2} strokeDasharray="4 10" />
        ))}
        <path d={GROWTH} stroke="url(#growth)" strokeWidth={8} fill="none" strokeLinecap="round" {...evolvePath(grow, GROWTH)} />
        {tip ? (
          <>
            <circle cx={tip.x} cy={tip.y} r={26} fill={color.cyan} opacity={0.18} />
            <circle cx={tip.x} cy={tip.y} r={11} fill={color.white} stroke={color.cyan} strokeWidth={5} />
          </>
        ) : null}
      </svg>
      <div style={{position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 14}}>
        <span style={{fontFamily: font.sans, fontSize: 28, fontWeight: 800, color: color.ink}}>함수 1강</span>
        <span
          style={{
            fontFamily: font.sans,
            fontSize: 20,
            fontWeight: 700,
            color: color.white,
            backgroundImage: AI_GRADIENT,
            borderRadius: 12,
            padding: '5px 12px',
          }}
        >
          AI 피드백 반영
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 120,
          display: 'flex',
          alignItems: 'flex-end',
          fontFamily: font.sans,
          fontSize: 190,
          fontWeight: 400 + level * 250,
          letterSpacing: '-0.05em',
          lineHeight: 1,
        }}
      >
        <span style={{lineHeight: '210px', fontWeight: 300, color: color.mute, marginRight: 4}}>v</span>
        <Reel
          id="version-reel"
          items={VERSIONS}
          value={value}
          velocity={velocity}
          height={210}
          width={330}
          itemStyle={(i) => (i === VERSIONS.length - 1 ? gradientChar(0, 1) : {color: color.ink})}
        />
      </div>
    </div>
  );
};

/** S11 — "내 강의는 계속 업그레이드된다." v1.0 → v3.0 on the beat, each step heavier. */
export const Upgrade: React.FC = () => (
  <FeatureFrame shot={getShot('S11')}>
    <UpgradeUI />
  </FeatureFrame>
);
