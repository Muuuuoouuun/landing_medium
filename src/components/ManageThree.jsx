import { CalendarCheck, Video, MessagesSquare } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'
import WaveDivider from './WaveDivider'

const cards = [
  {
    icon: <CalendarCheck size={26} />,
    label: '결석 보강',
    headline: '빠진 학생도 놓치지 않는다',
    body: '결석한 학생에게 오늘 수업이 자동으로 이어집니다. "다음에 따로 챙겨야지"가 그냥 처리됩니다.',
    color: '#0d6e4b',
  },
  {
    icon: <Video size={26} />,
    label: '수업 녹화·복습',
    headline: '오늘 한 수업이 사라지지 않는다',
    body: '수업이 끝나는 순간 녹화본이 남습니다. 학생은 언제든 다시 보고, 원장님은 무엇을 가르쳤는지 증명할 수 있습니다.',
    color: '#10b981',
  },
  {
    icon: <MessagesSquare size={26} />,
    label: '학부모 상담 근거',
    headline: '보여줄 게 남는다',
    body: '"우리 아이 요즘 어때요?"에 기억이 아니라 기록으로 답합니다. 수업·과제·피드백이 그대로 상담 자료가 됩니다.',
    color: '#34d399',
  },
]

export default function ManageThree() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [cardsRef, cardsVisible] = useStaggerReveal(3, { stagger: 160 })

  return (
    <section
      id="manage-three"
      className="section-wrap relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d2b1e 0%, #0a1f17 50%, #020f08 100%)' }}
    >
      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-float-slow"
          style={{
            width: 520, height: 520, left: '-8%', top: '-10%',
            background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 420, height: 420, right: '-6%', bottom: '0%',
            background: 'radial-gradient(circle, rgba(52,211,153,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animation: 'float 8s ease-in-out 1.5s infinite',
          }}
        />
      </div>

      <div className="content-col relative z-10">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 mb-5 rounded-full border" style={{color:'#34d399', borderColor:'#0d6e4b', background:'rgba(13,110,75,0.15)'}}>
            관리, 구체적으로
          </span>

          <h2 className="display-lg text-white mb-6">
            관리 = <span className="gradient-text animate-gradient-x">이 3가지</span>
          </h2>

          <div className="w-12 h-1 rounded-full mb-8" style={{background:'#0d6e4b'}} />

          <p className="text-xl text-slate-300 leading-relaxed mb-12 max-w-xl">
            막연한 단어가 아닙니다. 학원의 관리는 결국
            <span className="text-white font-semibold"> 이 3가지가 저절로 남느냐</span>로 갈립니다.
          </p>
        </div>

        <div ref={cardsRef} className="grid sm:grid-cols-3 gap-5">
          {cards.map((card, idx) => (
            <div
              key={card.label}
              className={`relative rounded-2xl p-6 card-lift stagger-item ${cardsVisible.has(idx) ? 'visible' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${card.color}40`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-5" style={{background:`linear-gradient(135deg, #0a1f17, ${card.color})`}}>
                {card.icon}
              </div>
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{color: card.color}}>
                {card.label}
              </div>
              <h3 className="text-lg font-bold text-white mb-3 leading-snug">
                {card.headline}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Wave divider → Essential (white) */}
      <WaveDivider fill="#ffffff" />
    </section>
  )
}
