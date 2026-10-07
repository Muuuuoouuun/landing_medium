import React from 'react';

/**
 * Directional (motion) blur through an inline SVG filter. CSS blur() is uniform, so whips and rolls
 * use this to smear only along the axis of travel.
 */
export const DirBlur: React.FC<{
  id: string;
  x?: number;
  y?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({id, x = 0, y = 0, style, children}) => {
  if (x < 0.25 && y < 0.25) {
    return <div style={style}>{children}</div>;
  }
  return (
    <div style={{...style, filter: `url(#${id})`}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={`${x} ${y}`} />
          </filter>
        </defs>
      </svg>
      {children}
    </div>
  );
};
