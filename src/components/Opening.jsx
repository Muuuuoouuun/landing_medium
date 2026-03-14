import { ArrowDown } from 'lucide-react'

export default function Opening() {
  return (
    <section
      id="opening"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #020f08 0%, #0a1f17 55%, #0d2b1e 100%)' }}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
        backgroundSize: '48px 48px'
      }} />

      <div className="relative section-wrap w-full">
        <div className="content-col">
          {/* Eyebrow */}
          <p className="text-forest-400 text-sm font-bold tracking-[0.2em] uppercase mb-8">
            클래스인 — 중형 학원 수업 통합 플랫폼
          </p>

          <h1 className="display-xl text-white mb-8">
            관리받은 학생은<br />
            <span className="text-forest-400">다릅니다.</span>
          </h1>

          <p className="text-xl text-slate-300 leading-relaxed max-w-xl mb-6">
            성적이 오르는 학원과 그냥 다니는 학원의 차이.
            그것은 교재도, 강사의 실력도 아닙니다.
          </p>
          <p className="text-xl text-forest-400 font-semibold leading-relaxed max-w-xl mb-12">
            그것은 <strong className="text-white">관리</strong>입니다.
          </p>

          <div className="flex items-center gap-4">
            <a href="#essential" className="btn-green" style={{backgroundColor: '#0d6e4b'}}
              onClick={e => { e.preventDefault(); document.getElementById('essential')?.scrollIntoView({ behavior: 'smooth' }) }}>
              이야기 읽기
              <ArrowDown size={18} />
            </a>
            <a href="#planning" className="text-slate-400 text-sm font-medium hover:text-white transition-colors underline underline-offset-4"
              onClick={e => { e.preventDefault(); document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }) }}>
              바로 도입 문의 →
            </a>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs">
        <span>스크롤</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
      </div>
    </section>
  )
}
