import type {CSSProperties} from 'react';

export const FPS = 30;
export const BPM = 90;
/** One beat at 90 BPM = 0.667s = 20 frames. Every cut in the script lands on this grid (30 beats = 20s). */
export const BEAT = (FPS * 60) / BPM;
export const DURATION = 600; // 20s

export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Light theme. The paper tone starts cool and tired (before ClassIn) and warms up after the S04 hit. */
export const color = {
  paperCool: '#E7EBE8',
  paper: '#F7F8F4',
  white: '#FFFFFF',
  ink: '#0B1410',
  inkSoft: '#3A4A42',
  mute: '#8A978F',
  line: '#E2E8E4',
  green: '#0F8A5E',
  greenBright: '#10B981',
  greenSoft: '#D1FAE5',
  greenDeep: '#0D6E4B',
  red: '#E5484D',
  redSoft: '#FDECEC',
  cyan: '#0EA5C6',
  blue: '#3B6CF6',
} as const;

export const AI_GRADIENT = `linear-gradient(90deg, ${color.greenBright}, ${color.cyan} 55%, ${color.blue})`;

export const font = {
  sans: 'Pretendard, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  /** End-card wordmark: Gilroy when its licensed file is in public/fonts, else Plus Jakarta Sans. */
  brand: 'Gilroy, "Plus Jakarta Sans", Pretendard, sans-serif',
} as const;

export const cardStyle: CSSProperties = {
  background: color.white,
  borderRadius: 32,
  border: `1px solid ${color.line}`,
  boxShadow: '0 44px 90px -34px rgba(11, 40, 28, 0.30), 0 14px 30px -14px rgba(11, 40, 28, 0.14)',
};
