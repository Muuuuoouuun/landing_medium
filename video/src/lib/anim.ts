import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 between two frames, clamped. */
export const ramp = (frame: number, from: number, to: number, easing: (t: number) => number = EASE_OUT) =>
  interpolate(frame, [from, to], [0, 1], {...CLAMP, easing});

/** Snappy spring with a little overshoot, starting at `delay`. */
export const pop = (frame: number, fps: number, delay = 0, config: Partial<{damping: number; stiffness: number; mass: number}> = {}) =>
  spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 190, mass: 0.7, ...config}});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
