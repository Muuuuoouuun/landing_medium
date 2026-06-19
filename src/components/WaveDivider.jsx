/**
 * WaveDivider — reusable bottom wave that sits flush at the bottom edge of a
 * `position: relative` parent section. Uses the same wave shape as the
 * Testimonials → Planning divider so every boundary shares one consistent shape.
 *
 * Props:
 *   - fill  : color of the wave; MUST match the NEXT section's top color.
 *   - flip  : optional, mirror the wave vertically.
 */
export default function WaveDivider({ fill, flip = false }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none"
      style={{ height: '100px', transform: flip ? 'scaleY(-1)' : undefined }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full"
        style={{ height: '100px' }}
      >
        <path
          d="M0,40 C240,100 480,20 720,60 C960,100 1200,30 1440,50 L1440,120 L0,120 Z"
          fill={fill}
        />
        <path
          d="M0,70 C180,40 360,90 540,55 C720,20 900,80 1080,50 C1260,30 1380,70 1440,60 L1440,120 L0,120 Z"
          fill={fill}
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
