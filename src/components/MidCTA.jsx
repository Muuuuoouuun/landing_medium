import { ArrowRight, Sparkles } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import WaveDivider from './WaveDivider'

export default function MidCTA() {
  const [ref, visible] = useScrollReveal()

  const goPlanning = e => {
    e.preventDefault()
    document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="mid-cta" className="section-wrap relative overflow-hidden" style={{ background:'#020f08' }}>
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full animate-float-slow"
          style={{
            width: 500, height: 300, left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(13,110,75,0.18) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div className="content-col relative z-10">
        <div
          ref={ref}
          className={`rounded-3xl p-8 sm:p-10 text-center animate-glow-pulse reveal-scale ${visible ? 'visible' : ''}`}
          style={{ background:'linear-gradient(135deg, #0d6e4b, #0f8a5e)' }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 mb-5 rounded-full" style={{ background:'rgba(255,255,255,0.15)', color:'#ffffff' }}>
            <Sparkles size={14} />
            부담 없이, 한 반부터
          </div>

          <h2 className="display-md text-white mb-4">
            끝까지 읽지 않으셔도 됩니다.<br />
            <span className="text-green-100">중등부 한 반 먼저 적용해보기.</span>
          </h2>

          <p className="text-green-100/90 text-base leading-relaxed mb-8 max-w-lg mx-auto">
            학원 전체를 한 번에 바꿀 필요 없습니다.
            한 반에서 결석 보강·녹화·상담 근거가 어떻게 남는지 먼저 확인해보세요.
          </p>

          <a
            href="#planning"
            onClick={goPlanning}
            className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-xl transition-all duration-300 hover:scale-[1.03] shadow-lg"
            style={{ background:'#ffffff', color:'#0d6e4b' }}
          >
            한 반 먼저 적용해보기
            <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* Wave divider → HowItWorks (light #f8faf9) */}
      <WaveDivider fill="#f8faf9" />
    </section>
  )
}
