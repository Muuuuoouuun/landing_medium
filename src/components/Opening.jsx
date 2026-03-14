import { useEffect, useState, useRef, useCallback } from 'react'
import { ArrowDown } from 'lucide-react'

/* ── Floating particle config ── */
const particles = [
  { size: 3, x: '12%', y: '18%', delay: 0, dur: 5, glow: false },
  { size: 6, x: '78%', y: '12%', delay: 0.8, dur: 6, glow: true },
  { size: 2, x: '62%', y: '68%', delay: 1.5, dur: 4.5, glow: false },
  { size: 5, x: '22%', y: '72%', delay: 0.3, dur: 5.5, glow: true },
  { size: 3, x: '88%', y: '42%', delay: 2, dur: 4, glow: false },
  { size: 4, x: '42%', y: '82%', delay: 1, dur: 5.8, glow: true },
  { size: 2, x: '68%', y: '28%', delay: 2.2, dur: 4.2, glow: false },
  { size: 3, x: '8%', y: '52%', delay: 1.4, dur: 6.2, glow: false },
  { size: 5, x: '52%', y: '8%',  delay: 0.6, dur: 5, glow: true },
  { size: 2, x: '35%', y: '55%', delay: 1.8, dur: 4.8, glow: false },
  { size: 4, x: '92%', y: '72%', delay: 0.2, dur: 5.2, glow: true },
  { size: 2, x: '18%', y: '38%', delay: 2.5, dur: 4.6, glow: false },
]

/* ── Animated light rays ── */
const rays = [
  { angle: -30, width: 120, left: '15%', delay: 0 },
  { angle: -20, width: 80,  left: '45%', delay: 2 },
  { angle: -35, width: 60,  left: '75%', delay: 4 },
]

export default function Opening() {
  const [loaded, setLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const sectionRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  /* ── Mouse-tracking glow ── */
  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }, [])

  return (
    <section
      id="opening"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #010a05 0%, #071a10 40%, #0a2418 70%, #0d2b1e 100%)' }}
    >

      {/* ═══════════════════════════════════
          LAYER 1 — Animated mesh gradient orbs
          ═══════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb — large, slow drift */}
        <div
          className="absolute rounded-full animate-float-slow"
          style={{
            width: 700, height: 700,
            left: '-10%', top: '-20%',
            background: 'radial-gradient(circle, rgba(13,110,75,0.18) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Secondary orb — right side, opposite phase */}
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            right: '-8%', bottom: '5%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.12) 0%, rgba(13,110,75,0.04) 50%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float 8s ease-in-out 2s infinite',
          }}
        />
        {/* Tertiary accent orb — smaller, faster */}
        <div
          className="absolute rounded-full"
          style={{
            width: 300, height: 300,
            left: '55%', top: '15%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 60%)',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out 1s infinite',
          }}
        />
      </div>

      {/* ═══════════════════════════════════
          LAYER 2 — Mouse-tracking interactive glow
          ═══════════════════════════════════ */}
      <div
        className="absolute pointer-events-none transition-all duration-[600ms] ease-out"
        style={{
          width: 500, height: 500,
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(13,110,75,0.15) 0%, rgba(16,185,129,0.05) 40%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ═══════════════════════════════════
          LAYER 3 — Light rays
          ═══════════════════════════════════ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {rays.map((ray, i) => (
          <div
            key={i}
            className="absolute top-0 h-full opacity-0"
            style={{
              left: ray.left,
              width: ray.width,
              background: `linear-gradient(${ray.angle}deg, transparent 0%, rgba(16,185,129,0.03) 30%, rgba(52,211,153,0.06) 50%, rgba(16,185,129,0.03) 70%, transparent 100%)`,
              animation: `hero-ray 8s ease-in-out ${ray.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════
          LAYER 4 — Hexagonal pattern (tech feel)
          ═══════════════════════════════════ */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hex" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
            <path d="M30,0 L60,15 L60,37 L30,52 L0,37 L0,15 Z" fill="none" stroke="#10b981" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
      </svg>

      {/* ═══════════════════════════════════
          LAYER 4.5 — Animated flowing SVG lines
          ═══════════════════════════════════ */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{opacity: 0.06}}>
        <path
          d="M-100,300 C200,100 400,500 700,250 C900,100 1100,400 1500,200"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeDasharray="1600"
          strokeDashoffset="1600"
          className="animate-draw-line-1"
        />
        <path
          d="M-50,500 C150,350 450,600 750,400 C1000,250 1200,550 1500,350"
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
          strokeDasharray="1600"
          strokeDashoffset="1600"
          className="animate-draw-line-2"
        />
        <path
          d="M-100,150 C300,300 500,50 800,200 C1000,300 1300,100 1500,250"
          fill="none"
          stroke="#34d399"
          strokeWidth="0.8"
          strokeDasharray="1600"
          strokeDashoffset="1600"
          className="animate-draw-line-3"
        />
      </svg>

      {/* ═══════════════════════════════════
          LAYER 5 — Noise texture overlay
          ═══════════════════════════════════ */}
      <div className="absolute inset-0 opacity-[0.35] mix-blend-overlay pointer-events-none hero-noise" />

      {/* ═══════════════════════════════════
          LAYER 6 — Floating particles
          ═══════════════════════════════════ */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: p.glow
              ? 'rgba(52, 211, 153, 0.5)'
              : 'rgba(52, 211, 153, 0.25)',
            boxShadow: p.glow
              ? '0 0 8px rgba(52,211,153,0.4), 0 0 20px rgba(52,211,153,0.15)'
              : 'none',
            animation: `float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ═══════════════════════════════════
          LAYER 7 — Vignette overlay
          ═══════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 30% 50%, transparent 30%, rgba(1,10,5,0.5) 100%)',
        }}
      />

      {/* ═══════════════════════════════════
          LAYER 8 — SVG Wave transition to next section
          ═══════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{height: '120px'}}>
        {/* Gradient fade before wave */}
        <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 0%, rgba(1,10,5,0.3) 100%)'}} />
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full"
          style={{height: '100px'}}
        >
          <path
            d="M0,64 C180,110 360,20 540,60 C720,100 900,30 1080,70 C1200,95 1350,45 1440,58 L1440,120 L0,120 Z"
            fill="#ffffff"
          />
          <path
            d="M0,80 C200,100 400,50 600,75 C800,100 1000,55 1200,78 C1350,92 1420,65 1440,72 L1440,120 L0,120 Z"
            fill="#ffffff"
            opacity="0.5"
          />
        </svg>
      </div>

      {/* ═══════════════════════════════════
          CONTENT
          ═══════════════════════════════════ */}
      <div className="relative section-wrap w-full z-10">
        {/* Glow ring behind content */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600, height: 250,
            left: '-5%', top: '30%',
            background: 'radial-gradient(ellipse, rgba(13,110,75,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div className="content-col relative">
          {/* Eyebrow */}
          <p className={`text-forest-400 text-sm font-bold tracking-[0.2em] uppercase mb-8 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            클래스인 — 중형 학원 수업 통합 플랫폼
          </p>

          {/* Title */}
          <h1 className={`display-xl text-white mb-8 transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            관리받은 학생은<br />
            <span className="gradient-text animate-gradient-x">다릅니다.</span>
          </h1>

          <p className={`text-xl text-slate-300 leading-relaxed max-w-xl mb-6 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            성적이 오르는 학원과 그냥 다니는 학원의 차이.
            그것은 교재도, 강사의 실력도 아닙니다.
          </p>
          <p className={`text-xl text-forest-400 font-semibold leading-relaxed max-w-xl mb-12 transition-all duration-700 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            그것은 <strong className="text-white">관리</strong>입니다.
          </p>

          <div className={`flex items-center gap-4 transition-all duration-700 delay-[900ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <a href="#essential" className="btn-green animate-glow-pulse" style={{backgroundColor: '#0d6e4b'}}
              onClick={e => { e.preventDefault(); document.getElementById('essential')?.scrollIntoView({ behavior: 'smooth' }) }}>
              이야기 읽기
              <ArrowDown size={18} className="animate-bounce-subtle" />
            </a>
            <a href="#planning" className="text-slate-400 text-sm font-medium hover:text-white transition-colors underline underline-offset-4"
              onClick={e => { e.preventDefault(); document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }) }}>
              바로 도입 문의 →
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className={`absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-500 text-xs transition-all duration-700 delay-[1200ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <span>스크롤</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
