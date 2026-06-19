import { useState } from 'react'
import { PlayCircle, Send, ClipboardEdit, MessageCircleHeart, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const steps = [
  {
    num: '①',
    icon: <PlayCircle size={24} />,
    time: '월 19:00',
    title: '수업 진행 — 자동 녹화 시작',
    desc: '함수 단원 수업을 시작합니다. 선생님이 버튼을 누를 필요도 없이, 수업과 동시에 녹화가 켜집니다.',
    detail: '오늘 가르친 내용이 그대로 기록으로 남기 시작합니다.',
  },
  {
    num: '②',
    icon: <Send size={24} />,
    time: '수업 종료 직후',
    title: '결석한 OO이에게 녹화본 자동 전송',
    desc: '오늘 빠진 학생에게 수업 녹화본이 자동으로 전달됩니다. 원장님이 따로 챙기지 않아도 보강이 시작됩니다.',
    detail: '"다음에 따로 봐줘야지"가 사라집니다. 결석이 곧 공백이 아닙니다.',
  },
  {
    num: '③',
    icon: <ClipboardEdit size={24} />,
    time: '당일 밤',
    title: '과제·피드백 기록',
    desc: '함수 과제를 출제하고, 제출과 피드백이 한 화면에 쌓입니다. 누가 풀었고 어디서 막혔는지 그대로 남습니다.',
    detail: '엑셀도, 카톡 검색도 필요 없습니다. 흐름이 저절로 정리됩니다.',
  },
  {
    num: '④',
    icon: <MessageCircleHeart size={24} />,
    time: '다음 주 상담',
    title: '학부모 상담 — 흐름을 근거로 대화',
    desc: '"지난주 함수 수업에서 이 부분을 어려워했고, 보강 후 과제는 이렇게 좋아졌어요." 기억이 아니라 기록으로 말합니다.',
    detail: '학부모의 신뢰는 이 한 번의 대화에서 결정됩니다.',
  },
]

export default function Simulation() {
  const [active, setActive] = useState(0)
  const [headerRef, headerVisible] = useScrollReveal()
  const [bodyRef, bodyVisible] = useScrollReveal()

  return (
    <section
      id="simulation"
      className="section-wrap relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #010a05 0%, #071a10 45%, #0d2b1e 100%)' }}
    >
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-float-slow"
          style={{
            width: 600, height: 600, right: '-12%', top: '-8%',
            background: 'radial-gradient(circle, rgba(13,110,75,0.16) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400, left: '-6%', bottom: '5%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float 9s ease-in-out 1s infinite',
          }}
        />
      </div>

      <div className="content-col relative z-10">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 mb-5 rounded-full border" style={{color:'#34d399', borderColor:'#0d6e4b', background:'rgba(13,110,75,0.15)'}}>
            내 학원에 적용하면?
          </span>

          <h2 className="display-lg text-white mb-6">
            중2 수학반,<br />
            <span className="gradient-text animate-gradient-x">오늘 함수 수업</span>
          </h2>

          <div className="w-12 h-1 rounded-full mb-8" style={{background:'#0d6e4b'}} />

          <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-xl">
            월요일 저녁 7시, 원장님 학원의 평범한 하루.
            <span className="text-white font-semibold"> 단계를 눌러보세요.</span>
            관리가 어떻게 저절로 흐르는지 직접 따라가실 수 있습니다.
          </p>
        </div>

        <div ref={bodyRef} className={`reveal ${bodyVisible ? 'visible' : ''}`}>
          {/* Step rail */}
          <div className="flex items-center gap-2 sm:gap-3 mb-8">
            {steps.map((step, idx) => (
              <div key={step.num} className="flex items-center flex-1">
                <button
                  onClick={() => setActive(idx)}
                  className="flex flex-col items-center gap-2 flex-1 group"
                  aria-label={step.title}
                >
                  <span
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${idx === active ? 'text-white scale-110 animate-glow-pulse' : 'text-slate-400'}`}
                    style={idx === active
                      ? { background: 'linear-gradient(135deg, #0d6e4b, #10b981)', boxShadow: '0 0 30px rgba(16,185,129,0.4)' }
                      : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    {step.icon}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-semibold transition-colors duration-300 ${idx === active ? 'text-forest-400' : 'text-slate-500'}`}>
                    {step.num}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className="h-px flex-shrink-0 w-3 sm:w-6 -mt-5 transition-colors duration-300"
                    style={{ background: idx < active ? '#10b981' : 'rgba(255,255,255,0.12)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Active step detail */}
          <div
            key={active}
            className="rounded-2xl p-7 sm:p-8 tab-content-enter"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(16,185,129,0.35)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ color:'#34d399', background:'rgba(13,110,75,0.25)' }}>
                {steps[active].time}
              </span>
              <span className="text-xs font-black tracking-widest text-slate-500">
                STEP {active + 1} / {steps.length}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
              {steps[active].title}
            </h3>
            <p className="text-base text-slate-300 leading-relaxed mb-5">
              {steps[active].desc}
            </p>

            <div className="rounded-xl p-4" style={{ background:'rgba(16,185,129,0.08)', borderLeft:'3px solid #10b981' }}>
              <p className="text-sm italic leading-relaxed" style={{ color:'#34d399' }}>
                {steps[active].detail}
              </p>
            </div>

            {/* Nav */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setActive(a => Math.max(0, a - 1))}
                disabled={active === 0}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← 이전
              </button>
              {active < steps.length - 1 ? (
                <button
                  onClick={() => setActive(a => Math.min(steps.length - 1, a + 1))}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest-400 hover:text-white transition-colors"
                >
                  다음 단계 <ArrowRight size={16} />
                </button>
              ) : (
                <a
                  href="#planning"
                  onClick={e => { e.preventDefault(); document.getElementById('planning')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-forest-400 hover:text-white transition-colors"
                >
                  내 학원에도 적용하기 <ArrowRight size={16} />
                </a>
              )}
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8 leading-relaxed">
            원장님이 한 일은 <span className="text-white font-semibold">수업을 한 것</span>뿐입니다.
            보강도, 기록도, 상담 근거도 — 시스템이 남겼습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
