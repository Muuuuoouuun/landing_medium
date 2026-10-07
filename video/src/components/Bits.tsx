import {evolvePath} from '@remotion/paths';
import React from 'react';
import {color, font} from '../theme';

const AVATAR = ['#A7F3D0', '#BAE6FD', '#FDE68A', '#FBCFE8', '#DDD6FE'];

export const Avatar: React.FC<{name: string; i: number; size?: number}> = ({name, i, size = 52}) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: AVATAR[i % AVATAR.length],
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: font.sans,
      fontWeight: 700,
      fontSize: size * 0.42,
      color: color.ink,
      flexShrink: 0,
    }}
  >
    {name[0]}
  </span>
);

export const CheckBadge: React.FC<{size: number; p: number}> = ({size, p}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{transform: `scale(${p})`}}>
    <circle cx={20} cy={20} r={20} fill={color.greenBright} />
    <path d="M11 20.5l6 6 12-13" stroke="white" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" {...evolvePath(p, 'M11 20.5l6 6 12-13')} />
  </svg>
);
