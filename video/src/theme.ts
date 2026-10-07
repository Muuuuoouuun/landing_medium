export const FPS = 30;
export const BPM = 120;
/** One beat at 120 BPM = 0.5s = 15 frames. Every cut in the script lands on this grid. */
export const BEAT = (FPS * 60) / BPM;
export const DURATION = 450; // 15s

export const WIDTH = 1920;
export const HEIGHT = 1080;

export const color = {
  ink: '#050807',
  inkSoft: '#0a1f17',
  paper: '#f4f7f5',
  mute: '#6b7d74',
  green: '#10b981',
  greenBright: '#34d399',
  greenDeep: '#0d6e4b',
  red: '#ff3b30',
  cyan: '#22d3ee',
} as const;

export const font = {
  sans: 'Pretendard, system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;
