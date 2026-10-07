import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckBadge} from '../components/Bits';
import {FeatureChip} from '../components/FeatureFrame';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_IN, EASE_IO, pop, ramp} from '../lib/anim';
import {getShot} from '../script';
import {AI_GRADIENT, cardStyle, color, font} from '../theme';

const TASKS = [
  {title: '숙제 확인', meta: '3반 · 미제출 2명', from: {x: -260, y: 120, r: -14}},
  {title: '보강 일정', meta: '민준 · 수요일', from: {x: 300, y: -40, r: 11}},
  {title: '상담 메모', meta: '서연 어머님', from: {x: -120, y: 260, r: 8}},
  {title: '출결 정리', meta: '이번 주', from: {x: 220, y: 300, r: -9}},
];
const SUMMARY = '이번 주 챙길 일 4건 · 미제출 2명 · 보강 1건';

/** S10 — "관리는 가벼워지고," Scattered to-dos get sorted and checked in one AI sweep. */
export const AIManage: React.FC = () => {
  const shot = getShot('S10');
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sweep = interpolate(frame, [3, 13], [-500, 1500], {...CLAMP, easing: EASE_IO});
  const bubble = pop(frame, fps, 12, {damping: 15});
  const typed = Math.round(interpolate(frame, [14, 27], [0, SUMMARY.length], CLAMP));
  const exit = ramp(frame, 26, 30, EASE_IN);

  return (
    <AbsoluteFill style={{opacity: 1 - exit * 0.5, transform: `translateY(${-exit * 40}px)`}}>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
        <div style={{marginBottom: 26}}>
          <FeatureChip shot={shot} appear={ramp(frame, 0, 6)} />
        </div>
        <KineticLine segs={shot.lines[0]} start={0} size={112} fxStart={13} fxDuration={14} />
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 300, top: 420, width: 600, height: 520}}>
        {TASKS.map((task, i) => {
          const settle = spring({frame: frame - 5 - i, fps, config: {damping: 15, stiffness: 150}});
          const enter = pop(frame, fps, i * 1.2, {damping: 18});
          const check = ramp(frame, 13 + i * 2.5, 18 + i * 2.5);
          return (
            <div
              key={task.title}
              style={{
                ...cardStyle,
                borderRadius: 22,
                position: 'absolute',
                left: 0,
                top: i * 124,
                width: 600,
                height: 104,
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                padding: '0 28px',
                opacity: enter,
                transform: `translate(${task.from.x * (1 - settle)}px, ${task.from.y * (1 - settle)}px) rotate(${task.from.r * (1 - settle)}deg) scale(${0.85 + 0.15 * enter})`,
              }}
            >
              {check > 0 ? (
                <CheckBadge size={44} p={check} />
              ) : (
                <span style={{width: 44, height: 44, borderRadius: 22, border: `3px solid ${color.line}`, flexShrink: 0}} />
              )}
              <span style={{fontFamily: font.sans, fontSize: 32, fontWeight: 800, color: check > 0.5 ? color.mute : color.ink}}>{task.title}</span>
              <span style={{marginLeft: 'auto', fontFamily: font.sans, fontSize: 24, fontWeight: 600, color: color.mute}}>{task.meta}</span>
            </div>
          );
        })}
      </div>

      {/* AI sweep across the task stack. */}
      <div
        style={{
          position: 'absolute',
          left: sweep,
          top: 380,
          width: 260,
          height: 600,
          transform: 'skewX(-18deg)',
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.28), rgba(255,255,255,0.6), rgba(34,211,238,0.28), transparent)',
          opacity: frame < 14 ? 1 : 0,
        }}
      />

      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          left: 1000,
          top: 540,
          width: 640,
          padding: '30px 36px 34px',
          borderRadius: 28,
          border: `2px solid rgba(14,165,198,0.35)`,
          transform: `translateY(${(1 - bubble) * 60}px) scale(${0.85 + 0.15 * bubble})`,
          transformOrigin: 'left top',
          opacity: Math.min(1, bubble * 1.4),
        }}
      >
        <div
          style={{
            fontFamily: font.sans,
            fontSize: 26,
            fontWeight: 800,
            backgroundImage: AI_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: 12,
          }}
        >
          AI 요약
        </div>
        <div style={{fontFamily: font.sans, fontSize: 32, fontWeight: 700, color: color.ink, lineHeight: 1.4, minHeight: 90}}>
          {SUMMARY.slice(0, typed)}
          <span style={{opacity: Math.floor(frame / 4) % 2 ? 0 : 1, color: color.cyan}}>|</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
