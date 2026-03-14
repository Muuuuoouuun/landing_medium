import { useState, useEffect } from 'react'

const chapters = [
  { id: 'opening',       num: '01', label: '관리받은 학생' },
  { id: 'essential',     num: '02', label: 'WHY — 왜 관리인가' },
  { id: 'hard',          num: '03', label: '현실의 벽' },
  { id: 'story',         num: '04', label: '원장님의 하루' },
  { id: 'pivot',         num: '05', label: 'HOW — 전환점' },
  { id: 'solution',      num: '06', label: 'WHAT — 클래스인' },
  { id: 'features',      num: '07', label: '도입 프로세스' },
  { id: 'testimonials',  num: '08', label: '후기' },
  { id: 'planning',      num: '09', label: '지금 시작하기' },
]

export default function JourneyTOC() {
  const [active, setActive] = useState('opening')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      // Overall scroll progress
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)

      // Active section detection
      const offsets = chapters.map(({ id }) => {
        const el = document.getElementById(id)
        return el ? { id, top: el.getBoundingClientRect().top } : { id, top: 9999 }
      })
      const current = offsets.filter(o => o.top <= 120).at(-1)
      if (current) setActive(current.id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeIdx = chapters.findIndex(c => c.id === active)

  return (
    <aside className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-0 select-none">
      {/* Progress bar */}
      <div className="absolute right-[11px] top-0 bottom-0 w-px bg-slate-200 rounded-full" />
      <div
        className="absolute right-[11px] top-0 w-px bg-forest-700 rounded-full transition-all duration-300"
        style={{ height: `${Math.min(100, (activeIdx / (chapters.length - 1)) * 100)}%` }}
      />

      {chapters.map((ch, idx) => {
        const isActive = ch.id === active
        const isPast = idx < activeIdx
        return (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            onClick={e => { e.preventDefault(); document.getElementById(ch.id)?.scrollIntoView({ behavior: 'smooth' }) }}
            className="group relative flex items-center gap-3 py-3 pr-0 pl-0"
          >
            {/* Label (appears on hover or active) */}
            <span className={`
              text-xs font-semibold whitespace-nowrap transition-all duration-200
              ${isActive ? 'text-forest-700 opacity-100 translate-x-0' : 'text-slate-400 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'}
            `}>
              <span className="text-[10px] mr-1 opacity-60">{ch.num}</span>
              {ch.label}
            </span>

            {/* Dot */}
            <div className={`
              relative z-10 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0
              ${isActive
                ? 'border-forest-700 bg-forest-700 scale-125'
                : isPast
                  ? 'border-forest-700 bg-forest-100'
                  : 'border-slate-300 bg-white group-hover:border-forest-700'}
            `}>
              {isPast && !isActive && (
                <svg className="w-2.5 h-2.5 text-forest-700" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
          </a>
        )
      })}

      {/* Scroll % */}
      <div className="mt-4 mr-0.5 text-[10px] font-bold text-slate-400 tabular-nums">
        {Math.round(progress)}%
      </div>
    </aside>
  )
}
