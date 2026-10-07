import {evolvePath, getLength, getPointAtLength} from '@remotion/paths';
import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {DirBlur} from '../components/DirBlur';
import {FeatureChip} from '../components/FeatureFrame';
import {KineticLine, gradientChar} from '../components/KineticLine';
import {CLAMP, EASE_IN, EASE_IO, EASE_OUT, pop, ramp} from '../lib/anim';
import {getShot} from '../script';
import {AI_GRADIENT, cardStyle, color, font} from '../theme';

/** Local frames where v1.0, v2.0 and v3.0 land (shared with the soundtrack via script marks). */
const MARKS = getShot('S11').marks ?? {v1: 4, v2: 20, v3: 40};
const STEPS = [MARKS.v1, MARKS.v2, MARKS.v3];
/**
 * Growth follows a true exponential, y = base − a·(e^{k·(x − x0)} − 1): nearly flat at v1.0,
 * bending at v2.0, and shooting off the top-right corner after v3.0.
 */
const GROWTH = {x0: 90, base: 990, a: 32.4, k: 0.00188};
const growthY = (x: number) => GROWTH.base - GROWTH.a * (Math.exp(GROWTH.k * (x - GROWTH.x0)) - 1);
const curve = (x0: number, x1: number, steps = 32) =>
  Array.from({length: steps + 1}, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / steps;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${growthY(x).toFixed(1)}`;
  }).join(' ');

const NODES = [420, 980, 1440].map((x) => ({x, y: growthY(x)}));
/** Cards sit up-left of their node so the steep part of the curve stays in view. */
const CARD_DX = [0, -60, -150];
const BASELINE = 1010;
const TINTS = [color.greenBright, color.cyan, color.blue];

// Scores climb faster each step (▲11, ▲18) so the numbers tell the same exponential story as the curve.
const VERSIONS = [
  {v: 'v1.0', score: 68, note: '기본 강의안', weight: 420},
  {v: 'v2.0', score: 79, note: '+ 질문 타이밍', weight: 650},
  {v: 'v3.0', score: 97, note: '+ 예시 추가 · 속도 조절', weight: 900},
];

/** AI feedback that flies into the next node and triggers each upgrade. */
const FEEDBACK = [
  {text: 'AI 피드백 · 질문 타이밍', from: {x: 690, y: 340}, to: 1},
  {text: 'AI 피드백 · 예시 추가', from: {x: 1200, y: 340}, to: 2},
];

/** Growth line, drawn one segment per upgrade; `NEXT` is the dashed promise of the next version. */
const SEGMENTS = [
  {d: curve(GROWTH.x0, NODES[0].x, 12), draw: [0, STEPS[0] + 2]},
  {d: curve(NODES[0].x, NODES[1].x), draw: [STEPS[1] - 10, STEPS[1]]},
  {d: curve(NODES[1].x, NODES[2].x), draw: [STEPS[2] - 12, STEPS[2]]},
];
const FULL_PATH = SEGMENTS.map((seg, i) => (i === 0 ? seg.d : seg.d.replace(/^M /, 'L '))).join(' ');
const SEGMENT_LENGTHS = SEGMENTS.map((seg) => getLength(seg.d));
const FULL_LENGTH = getLength(FULL_PATH);
// Past v3.0 the curve keeps going, steeper, out through the top-right corner.
const NEXT = curve(NODES[2].x, 1960, 40);
/** Where the "next version" tag sits: just left of the line near the top edge. */
const NEXT_TAG = {x: 1600, y: 34};
const SPARKLE = 'M 0 -14 L 3.5 -3.5 L 14 0 L 3.5 3.5 L 0 14 L -3.5 3.5 L -14 0 L -3.5 -3.5 Z';

const landSpring = (frame: number, fps: number, at: number) =>
  spring({frame: frame - at, fps, config: {damping: 12, stiffness: 170, mass: 0.75}});

const ScoreRing: React.FC<{score: number; fill: number; tint: string}> = ({score, fill, tint}) => {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div style={{position: 'relative', width: 84, height: 84}}>
      <svg width={84} height={84} viewBox="0 0 84 84" style={{transform: 'rotate(-90deg)'}}>
        <circle cx={42} cy={42} r={r} stroke="#EEF2EF" strokeWidth={8} fill="none" />
        <circle cx={42} cy={42} r={r} stroke={tint} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={`${c * (score / 100) * fill} ${c}`} />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: font.mono,
          fontSize: 26,
          fontWeight: 700,
          color: color.ink,
        }}
      >
        {Math.round(score * fill)}
      </div>
    </div>
  );
};

const UpTriangle: React.FC = () => (
  <svg width={14} height={12} viewBox="0 0 14 12">
    <path d="M7 0L14 12H0z" fill="white" />
  </svg>
);

const VersionCard: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const version = VERSIONS[i];
  const node = NODES[i];
  const hero = i === VERSIONS.length - 1;
  const land = landSpring(frame, fps, STEPS[i]);
  const dim = i < VERSIONS.length - 1 ? ramp(frame, STEPS[i + 1], STEPS[i + 1] + 8) : 0;
  const ringFill = ramp(frame, STEPS[i] + 2, STEPS[i] + 14, EASE_IO);
  const glow = hero ? ramp(frame, STEPS[i], STEPS[i] + 10) : 0;
  const shine = interpolate(frame, [STEPS[i] + 2, STEPS[i] + 14], [-0.3, 1.3], {...CLAMP, easing: EASE_IO});
  const badge = pop(frame, fps, STEPS[i] + 6, {damping: 11, stiffness: 240});
  const w = hero ? 430 : 360;
  const h = hero ? 236 : 204;
  if (frame < STEPS[i] - 1) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: node.x - w / 2 + CARD_DX[i],
        top: node.y - 44 - h,
        width: w,
        height: h,
        opacity: Math.min(1, land * 1.6) * (1 - 0.45 * dim),
        transform: `translateY(${(1 - land) * -80}px) scale(${(0.82 + 0.18 * land) * (1 - 0.06 * dim)})`,
      }}
    >
      <div
        style={{
          ...cardStyle,
          position: 'absolute',
          inset: 0,
          borderRadius: 26,
          padding: '22px 26px',
          overflow: 'hidden',
          boxShadow: hero
            ? `0 0 0 ${2 * glow}px rgba(14,165,198,0.55), 0 40px 90px -24px rgba(14,165,198,${0.55 * glow}), ${cardStyle.boxShadow}`
            : cardStyle.boxShadow,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <div style={{fontFamily: font.sans, fontSize: 24, fontWeight: 700, color: color.mute}}>함수 1강</div>
            <div
              style={{
                fontFamily: font.sans,
                fontSize: hero ? 100 : 88,
                fontWeight: version.weight,
                letterSpacing: '-0.05em',
                lineHeight: 1.05,
                marginTop: 4,
                ...(hero ? gradientChar(0, 1) : {color: color.ink}),
              }}
            >
              {version.v}
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <ScoreRing score={version.score} fill={ringFill} tint={TINTS[i]} />
            <span style={{fontFamily: font.sans, fontSize: 15, fontWeight: 700, color: color.mute}}>AI 평가</span>
          </div>
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: font.sans,
            fontSize: 22,
            fontWeight: 700,
            color: i === 0 ? color.mute : color.cyan,
            whiteSpace: 'nowrap',
          }}
        >
          {version.note}
        </div>
        {/* Shine sweep when the card lands. */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            bottom: -20,
            left: shine * w - 70,
            width: 140,
            transform: 'skewX(-20deg)',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
            opacity: shine > -0.3 && shine < 1.3 ? 1 : 0,
          }}
        />
      </div>
      {i > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 16px',
            borderRadius: 22,
            background: hero ? AI_GRADIENT : TINTS[i],
            boxShadow: `0 12px 24px -10px ${TINTS[i]}`,
            fontFamily: font.mono,
            fontSize: 24,
            fontWeight: 700,
            color: color.white,
            transform: `scale(${badge})`,
            transformOrigin: 'right center',
          }}
        >
          <UpTriangle />
          {version.score - VERSIONS[i - 1].score}
        </div>
      ) : null}
    </div>
  );
};

const feedbackPosition = (i: number, frame: number) => {
  const item = FEEDBACK[i];
  const arrive = STEPS[item.to];
  const t = ramp(frame, arrive - 12, arrive, EASE_IN);
  const to = NODES[item.to];
  // Quadratic arc: sideways first, then down into the node.
  const cx = to.x;
  const cy = item.from.y;
  return {
    t,
    x: (1 - t) ** 2 * item.from.x + 2 * (1 - t) * t * cx + t ** 2 * to.x,
    y: (1 - t) ** 2 * item.from.y + 2 * (1 - t) * t * cy + t ** 2 * to.y,
  };
};

const FlyingFeedback: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const item = FEEDBACK[i];
  const arrive = STEPS[item.to];
  const launch = arrive - 12;
  if (frame < launch - 9 || frame >= arrive) return null;
  const appear = pop(frame, fps, launch - 9, {damping: 14, stiffness: 260});
  const now = feedbackPosition(i, frame);
  const prev = feedbackPosition(i, frame - 1);
  return (
    <DirBlur
      id={`feedback-blur-${i}`}
      x={Math.min(Math.abs(now.x - prev.x) * 0.22, 10)}
      y={Math.min(Math.abs(now.y - prev.y) * 0.22, 10)}
      style={{position: 'absolute', left: now.x, top: now.y}}
    >
      <div
        style={{
          transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * appear) * (1 - 0.65 * now.t)})`,
          opacity: Math.min(1, appear * 1.4),
          padding: '12px 22px',
          borderRadius: 30,
          background: 'rgba(255,255,255,0.95)',
          border: `2px solid ${color.cyan}`,
          boxShadow: '0 18px 36px -16px rgba(14,165,198,0.7)',
          fontFamily: font.sans,
          fontSize: 26,
          fontWeight: 800,
          color: color.ink,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{width: 12, height: 12, borderRadius: 6, backgroundImage: AI_GRADIENT}} />
        {item.text}
      </div>
    </DirBlur>
  );
};

/** Light particles that keep travelling up the drawn part of the growth line — "계속". */
const FlowDots: React.FC = () => {
  const frame = useCurrentFrame();
  const drawn = SEGMENTS.reduce((sum, seg, k) => sum + SEGMENT_LENGTHS[k] * ramp(frame, seg.draw[0], seg.draw[1], EASE_IO), 0);
  return (
    <>
      {Array.from({length: 7}).map((_, k) => {
        const s = (frame * 24 + k * (FULL_LENGTH / 7)) % FULL_LENGTH;
        if (s > drawn - 20) return null;
        const pt = getPointAtLength(FULL_PATH, s);
        if (!pt) return null;
        // Fade in at the start of the line and out just before the drawing tip.
        const fade = Math.min(1, s / 60, Math.max(0, (drawn - 20 - s) / 100));
        return (
          <g key={k} opacity={fade}>
            <circle cx={pt.x} cy={pt.y} r={14} fill={color.cyan} opacity={0.18} />
            <circle cx={pt.x} cy={pt.y} r={5.5} fill={color.white} stroke={color.cyan} strokeWidth={2.5} />
          </g>
        );
      })}
    </>
  );
};

/**
 * S11 — "내 강의는 계속 업그레이드됩니다." AI feedback flies in, and the lecture climbs a staircase
 * of versions: each step raises a score bar, refills the score ring and lands a heavier card.
 */
export const Upgrade: React.FC = () => {
  const shot = getShot('S11');
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // The headline's "업그레이드" gets heavier on the same beats as the cards.
  const level = (landSpring(frame, fps, STEPS[1]) + landSpring(frame, fps, STEPS[2])) / 2;

  // Camera drifts up and to the right with the climb.
  const push = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  const punch = STEPS.slice(1).reduce((sum, s) => sum + interpolate(frame, [s, s + 1, s + 9], [0, 0.014, 0], CLAMP), 0);
  // The camera tilts up and right after the curve as it takes off.
  const driftX = interpolate(frame, [0, 56], [30, -30], {...CLAMP, easing: EASE_IO});
  const driftY = interpolate(frame, [0, 56], [-10, 28], {...CLAMP, easing: EASE_IO});
  const exit = ramp(frame, durationInFrames - 6, durationInFrames, EASE_IN);
  const next = ramp(frame, STEPS[2] + 6, STEPS[2] + 16, EASE_IO);

  return (
    <AbsoluteFill style={{opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined, transform: `scale(${1 + exit * 0.06})`}}>
      <AbsoluteFill style={{transform: `translate(${driftX}px, ${driftY}px) scale(${push + punch})`, transformOrigin: '75% 40%'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <defs>
            <linearGradient id="climb-line" gradientUnits="userSpaceOnUse" x1={90} y1={0} x2={1850} y2={0}>
              <stop offset="0%" stopColor={color.greenBright} />
              <stop offset="55%" stopColor={color.cyan} />
              <stop offset="100%" stopColor={color.blue} />
            </linearGradient>
            {TINTS.map((tint, i) => (
              <linearGradient key={tint} id={`column-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tint} stopOpacity={0.34} />
                <stop offset="100%" stopColor={tint} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>

          {[430, 600, 770, 940].map((y) => (
            <line key={y} x1={60} x2={1860} y1={y} y2={y} stroke={color.line} strokeWidth={2} strokeDasharray="4 12" />
          ))}
          <line x1={60} x2={1860} y1={BASELINE} y2={BASELINE} stroke="#D3DBD6" strokeWidth={2} />

          {/* Score columns rising from the baseline to each node. */}
          {NODES.map((node, i) => {
            const rise = landSpring(frame, fps, STEPS[i] - 3);
            const height = (BASELINE - node.y) * Math.min(1.04, rise);
            return <rect key={i} x={node.x - 64} y={BASELINE - height} width={128} height={Math.max(0, height)} rx={18} fill={`url(#column-${i})`} />;
          })}

          {SEGMENTS.map((seg) => (
            <path
              key={seg.d}
              d={seg.d}
              stroke="url(#climb-line)"
              strokeWidth={9}
              strokeLinecap="round"
              fill="none"
              {...evolvePath(ramp(frame, seg.draw[0], seg.draw[1], EASE_IO), seg.d)}
            />
          ))}
          <FlowDots />
          <mask id="next-mask">
            <path d={NEXT} stroke="white" strokeWidth={16} fill="none" {...evolvePath(next, NEXT)} />
          </mask>
          <path
            d={NEXT}
            stroke={color.blue}
            strokeWidth={5}
            strokeDasharray="2 16"
            strokeLinecap="round"
            fill="none"
            mask="url(#next-mask)"
            opacity={0.75}
          />

          {NODES.map((node, i) => {
            const at = STEPS[i];
            const nodeIn = pop(frame, fps, at - 1, {damping: 11, stiffness: 260});
            const burst = ramp(frame, at, at + 16);
            return (
              <g key={i}>
                {frame >= at ? <circle cx={node.x} cy={node.y} r={16 + burst * (i === 2 ? 130 : 84)} fill="none" stroke={TINTS[i]} strokeWidth={i === 2 ? 6 : 4} opacity={(1 - burst) * 0.8} /> : null}
                <circle cx={node.x} cy={node.y} r={26 * nodeIn} fill={TINTS[i]} opacity={0.18} />
                <circle cx={node.x} cy={node.y} r={13 * nodeIn} fill={color.white} stroke={TINTS[i]} strokeWidth={6} />
              </g>
            );
          })}

          {/* Sparkles around the final version. */}
          {Array.from({length: 8}).map((_, k) => {
            const t = ramp(frame, STEPS[2], STEPS[2] + 18, EASE_OUT);
            if (frame < STEPS[2] || t >= 1) return null;
            const angle = (k / 8) * Math.PI * 2 + 0.3;
            const dist = 60 + t * (k % 2 ? 120 : 170);
            const cx = NODES[2].x + Math.cos(angle) * dist;
            const cy = NODES[2].y - 150 + Math.sin(angle) * dist * 0.75;
            return (
              <path
                key={k}
                d={SPARKLE}
                fill={k % 2 ? color.cyan : color.greenBright}
                transform={`translate(${cx} ${cy}) rotate(${t * 180}) scale(${(1 - t) * (k % 3 === 0 ? 1.4 : 1)})`}
              />
            );
          })}
        </svg>

        {/* The next version, already on its way up. */}
        <div
          style={{
            position: 'absolute',
            left: NEXT_TAG.x,
            top: NEXT_TAG.y,
            display: 'flex',
            alignItems: 'baseline',
            gap: 12,
            padding: '10px 20px',
            borderRadius: 18,
            border: `3px dashed ${color.blue}`,
            background: 'rgba(255,255,255,0.55)',
            opacity: 0.85 * ramp(frame, STEPS[2] + 10, STEPS[2] + 17),
            transform: `translateY(${(1 - ramp(frame, STEPS[2] + 10, STEPS[2] + 17)) * 24}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{fontFamily: font.sans, fontSize: 46, fontWeight: 300, letterSpacing: '-0.05em', color: color.blue}}>v4.0</span>
          <span style={{fontFamily: font.sans, fontSize: 20, fontWeight: 700, color: color.mute}}>다음 수업</span>
        </div>

        {VERSIONS.map((_, i) => (
          <VersionCard key={i} i={i} />
        ))}

        {FEEDBACK.map((_, i) => (
          <FlyingFeedback key={i} i={i} />
        ))}
      </AbsoluteFill>

      <AbsoluteFill style={{alignItems: 'center', paddingTop: 50}}>
        <div style={{marginBottom: 20}}>
          <FeatureChip shot={shot} appear={ramp(frame, 0, 8)} />
        </div>
        <KineticLine segs={shot.lines[0]} start={2} size={96} fxValue={level} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
