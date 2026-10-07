import React from 'react';
import {DirBlur} from './DirBlur';

/**
 * A vertical reel showing `items`, positioned at `value` (float index). Integer values rest on an item,
 * fractions sit between two items. `velocity` (items per frame) drives the vertical motion blur.
 */
export const Reel: React.FC<{
  id: string;
  items: string[];
  value: number;
  velocity?: number;
  height: number;
  width?: number | string;
  itemStyle?: (index: number) => React.CSSProperties;
}> = ({id, items, value, velocity = 0, height, width, itemStyle}) => {
  return (
    <span style={{display: 'inline-block', height, width, overflow: 'hidden', verticalAlign: 'bottom', position: 'relative'}}>
      <DirBlur id={id} y={Math.min(Math.abs(velocity) * height * 0.18, 18)}>
        <div style={{transform: `translateY(${-value * height}px)`}}>
          {items.map((item, i) => (
            <div key={i} style={{height, lineHeight: `${height}px`, textAlign: 'center', whiteSpace: 'pre', ...itemStyle?.(i)}}>
              {item}
            </div>
          ))}
        </div>
      </DirBlur>
    </span>
  );
};

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const TENS_OF_MINUTES = ['0', '1', '2', '3', '4', '5', '0'];

/**
 * Odometer-style HH:MM clock driven by a float number of minutes, so time can slip forward or rewind
 * continuously. `spin` (0–1) adds whole extra revolutions per digit for the roll-in, so the clock
 * reads the real time at both ends of the spin.
 */
export const Clock: React.FC<{
  id: string;
  minutes: number;
  velocity?: number;
  size: number;
  spin?: number;
  /** Change of `spin` per frame, for blur. */
  spinVelocity?: number;
  colonOn?: boolean;
  tint?: string;
}> = ({id, minutes, velocity = 0, size, spin = 0, spinVelocity = 0, colonOn = true, tint}) => {
  const total = ((minutes % 1440) + 1440) % 1440;
  const m = total % 60;
  const hours = Math.floor(total / 60);
  const minuteOnes = total % 10;
  const minuteTens = Math.floor(m / 10) + Math.max(0, minuteOnes - 9);
  const hourCarry = Math.max(0, m - 59);
  const hourOnes = (hours % 10) + hourCarry;
  const hourTens = Math.floor(hours / 10);
  const h = size * 1.02;

  const wrap = (v: number, n: number) => ((v % n) + n) % n;
  const reel = (key: string, items: string[], v: number, n: number, turns: number, vel: number) => (
    <Reel
      id={`${id}-${key}`}
      items={items}
      value={wrap(v + spin * turns, n)}
      velocity={vel + Math.abs(spinVelocity) * turns}
      height={h}
      width={size * 0.62}
    />
  );

  return (
    <div style={{display: 'flex', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, fontSize: size, color: tint}}>
      {reel('h10', DIGITS, hourTens, 10, 10, 0)}
      {reel('h1', DIGITS, hourOnes, 10, 10, Math.abs(velocity) / 60)}
      <span style={{width: size * 0.6, margin: `0 ${-size * 0.1}px`, textAlign: 'center', opacity: colonOn ? 1 : 0.2, transform: `translateY(${-size * 0.06}px)`}}>:</span>
      {reel('m10', TENS_OF_MINUTES, minuteTens, 6, 6, Math.abs(velocity) / 10)}
      {reel('m1', DIGITS, minuteOnes, 10, 20, Math.abs(velocity))}
    </div>
  );
};
