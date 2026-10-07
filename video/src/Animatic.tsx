import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ACT_LABEL, SHOTS, type Shot} from './script';
import {BEAT, DURATION, FPS, color, font} from './theme';

/**
 * Timing animatic: every shot from the script on its beat, with the copy at final size and the
 * visual brief as a caption. It exists to judge pacing and readability before the full build.
 */

const tc = (frame: number) => {
  const s = Math.floor(frame / FPS);
  const f = frame % FPS;
  return `00:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
};

const splitAccent = (text: string, accent: string[] = []) => {
  if (accent.length === 0) return [{text, hot: false}];
  const pattern = new RegExp(`(${accent.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`);
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({text: part, hot: accent.includes(part)}));
};

const accentColor = (shot: Shot) =>
  shot.act === 'PROBLEM' || shot.id === 'S04' ? color.red : shot.act === 'AI' ? color.cyan : color.greenBright;

const RevealLine: React.FC<{shot: Shot; size: number}> = ({shot, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const parts = splitAccent(shot.main, shot.accent);
  let charIndex = 0;

  return (
    <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, textAlign: 'center'}}>
      {parts.map((part, p) => (
        <span key={p} style={{color: part.hot ? accentColor(shot) : color.paper}}>
          {[...part.text].map((ch) => {
            const i = charIndex++;
            const t = spring({frame: frame - i * 0.6, fps, config: {damping: 18, stiffness: 220}});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  whiteSpace: 'pre',
                  opacity: t,
                  transform: `translateY(${(1 - t) * 40}px)`,
                  filter: `blur(${(1 - t) * 12}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
};

const Storm: React.FC<{words: string[]}> = ({words}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({length: Math.min(words.length * 2, Math.floor(frame / 1.2) + 1)}).map((_, i) => {
        const w = words[i % words.length];
        const x = random(`x${i}`) * 1500 + 60;
        const y = random(`y${i}`) * 640 + 120;
        const rot = (random(`r${i}`) - 0.5) * 16;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize: 54 + random(`s${i}`) * 50,
              fontWeight: 700,
              color: i % 5 === 0 ? color.red : color.paper,
              opacity: 0.55 + random(`o${i}`) * 0.45,
              transform: `rotate(${rot}deg)`,
              whiteSpace: 'nowrap',
            }}
          >
            {w}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const ShotCard: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const subIn = spring({frame: frame - 6, fps, config: {damping: 200}});
  const mainSize = shot.id === 'S10' ? 420 : shot.main.length > 14 ? 104 : 140;

  return (
    <AbsoluteFill style={{fontFamily: font.sans}}>
      {shot.storm ? <Storm words={shot.storm} /> : null}

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 120px'}}>
        {shot.index ? (
          <div
            style={{
              fontFamily: font.mono,
              fontSize: 120,
              fontWeight: 700,
              color: 'transparent',
              WebkitTextStroke: `2px ${color.green}`,
              marginBottom: 8,
            }}
          >
            {shot.index}
          </div>
        ) : null}
        {shot.main ? <RevealLine shot={shot} size={mainSize} /> : null}
        {shot.sub ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 52,
              fontWeight: 500,
              color: color.mute,
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 20}px)`,
            }}
          >
            {shot.sub}
          </div>
        ) : null}
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 48, left: 64, fontFamily: font.mono, fontSize: 24, color: color.green}}>
        {ACT_LABEL[shot.act]}
      </div>
      <div style={{position: 'absolute', top: 48, right: 64, fontFamily: font.mono, fontSize: 24, color: color.mute}}>
        {shot.id} · {tc(shot.from)} – {tc(shot.from + shot.durationInFrames)}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 64,
          right: 64,
          bottom: 70,
          fontSize: 24,
          lineHeight: 1.45,
          color: '#8fa39a',
          borderLeft: `3px solid ${color.greenDeep}`,
          paddingLeft: 18,
        }}
      >
        <b style={{color: color.paper}}>VISUAL</b> {shot.visual}
        <br />
        <b style={{color: color.paper}}>MOTION</b> {shot.motion} &nbsp; <b style={{color: color.paper}}>SFX</b> {shot.sfx}
      </div>
    </AbsoluteFill>
  );
};

const BeatTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const beatPhase = (frame % BEAT) / BEAT;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 52,
          left: '50%',
          width: 16,
          height: 16,
          marginLeft: -8,
          borderRadius: 8,
          background: color.greenBright,
          opacity: interpolate(beatPhase, [0, 0.4], [1, 0.15], {extrapolateRight: 'clamp'}),
        }}
      />
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 6, width: `${(frame / DURATION) * 100}%`, background: color.green}} />
    </>
  );
};

export const Animatic: React.FC = () => {
  return (
    <AbsoluteFill style={{background: color.ink}}>
      {SHOTS.map((shot) => (
        <Sequence key={shot.id} from={shot.from} durationInFrames={shot.durationInFrames} name={`${shot.id} ${shot.main}`}>
          <ShotCard shot={shot} />
        </Sequence>
      ))}
      <BeatTrack />
    </AbsoluteFill>
  );
};
