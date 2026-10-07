import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {KineticLine} from '../components/KineticLine';
import {CLAMP, EASE_IN, EASE_OUT, ramp} from '../lib/anim';
import {getShot} from '../script';
import {color, font} from '../theme';

const MicOff: React.FC = () => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <circle cx={15} cy={15} r={15} fill={color.red} />
    <rect x={11} y={7} width={8} height={12} rx={4} fill="white" />
    <path d="M9 15a6 6 0 0 0 12 0M15 21v3" stroke="white" strokeWidth={2} fill="none" />
    <path d="M7 23L23 7" stroke="white" strokeWidth={2.6} />
  </svg>
);

const Tile: React.FC<{i: number; fall: number}> = ({i, fall}) => (
  <div
    style={{
      borderRadius: 16,
      background: `linear-gradient(160deg, #DCE1DE, #C9D0CC)`,
      position: 'relative',
      overflow: 'hidden',
      transformOrigin: 'center bottom',
      transform: `rotateX(${-fall * 100}deg)`,
      opacity: interpolate(fall, [0.6, 1], [1, 0], CLAMP),
      boxShadow: fall > 0 ? `0 ${20 * fall}px ${30 * fall}px rgba(0,0,0,${0.18 * fall})` : undefined,
    }}
  >
    <div style={{position: 'absolute', left: '50%', top: '22%', width: 64, height: 64, marginLeft: -32, borderRadius: 32, background: '#B3BCB7'}} />
    <div style={{position: 'absolute', left: '50%', top: '62%', width: 120, height: 80, marginLeft: -60, borderRadius: '60px 60px 0 0', background: '#B3BCB7'}} />
    <div
      style={{
        position: 'absolute',
        left: 12,
        bottom: 10,
        padding: '4px 10px',
        borderRadius: 8,
        background: 'rgba(11,20,16,0.55)',
        color: 'white',
        fontFamily: font.sans,
        fontSize: 16,
        fontWeight: 600,
      }}
    >
      참가자 {i + 1}
    </div>
    <div style={{position: 'absolute', right: 10, bottom: 8}}>
      <MicOff />
    </div>
  </div>
);

/** S03 — "회의용 툴을 내려놓았다." The meeting grid topples like dominoes, then the window drops. */
export const MeetingTool: React.FC = () => {
  const shot = getShot('S03');
  const frame = useCurrentFrame();
  const enter = ramp(frame, 0, 8);
  const drop = ramp(frame, 20, 30, EASE_IN);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 110}}>
        <KineticLine segs={shot.lines[0]} start={0} size={104} fxStart={15} fxDuration={13} />
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 40, perspective: 1800}}>
        <div
          style={{
            width: 1060,
            height: 640,
            borderRadius: 26,
            background: '#F2F4F3',
            border: `1px solid ${color.line}`,
            boxShadow: '0 50px 100px -40px rgba(11,40,28,0.45)',
            transform: `translateY(${(1 - enter) * 120 + drop * 760}px) rotateX(${16 + drop * 35}deg) scale(${0.92 + enter * 0.08})`,
            opacity: enter * (1 - drop * 0.6),
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{height: 56, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px', borderBottom: `1px solid ${color.line}`}}>
            {['#F26B6B', '#F5C04D', '#5CCB7C'].map((c) => (
              <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
            ))}
            <span style={{marginLeft: 14, fontFamily: font.sans, fontSize: 20, fontWeight: 600, color: color.mute}}>회의 · 참가자 9명</span>
          </div>
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 12,
              padding: 16,
              perspective: 1200,
            }}
          >
            {Array.from({length: 9}).map((_, i) => (
              <Tile key={i} i={i} fall={ramp(frame, 7 + i * 1.5, 15 + i * 1.5, EASE_IN)} />
            ))}
          </div>
          <div style={{height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, borderTop: `1px solid ${color.line}`}}>
            {[0, 1, 2, 3].map((k) => (
              <span key={k} style={{width: 40, height: 40, borderRadius: 20, background: '#DCE1DE'}} />
            ))}
            <span
              style={{
                marginLeft: 26,
                padding: '10px 26px',
                borderRadius: 22,
                background: color.red,
                color: 'white',
                fontFamily: font.sans,
                fontSize: 20,
                fontWeight: 700,
                opacity: ramp(frame, 3, 9, EASE_OUT),
              }}
            >
              회의 나가기
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
