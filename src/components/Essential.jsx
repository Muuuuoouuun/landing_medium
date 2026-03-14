import { TrendingUp, Users, Trophy, BarChart2, BookOpen, Brain, Target } from 'lucide-react'
import { useScrollReveal, useStaggerReveal, useCountUp } from '../hooks/useScrollReveal'

const stats = [
  { value: 2.4, suffix: '배', label: '관리받은 학생의 평균 성적 향상률', sub: '비관리 학생 대비' },
  { value: 83, suffix: '%', label: '학원 이탈 방지 효과', sub: '정기 관리 피드백 제공 시' },
  { value: 3, suffix: '개월', label: '관리 효과가 수치로 나타나는 기간', sub: '주 2회 이상 피드백 기준' },
]

const theories = [
  {
    icon: <Brain size={20} />,
    person: '벤자민 블룸 (Benjamin Bloom)',
    title: '완전학습이론 — Mastery Learning',
    quote: '적절한 피드백과 교정이 주어지면, 95%의 학생이 학습 목표에 도달할 수 있다.',
    insight: '관리의 핵심은 피드백입니다. 블룸은 "재능의 차이"가 아닌 "피드백의 차이"가 성적을 결정한다고 증명했습니다.',
  },
  {
    icon: <Target size={20} />,
    person: '존 해티 (John Hattie)',
    title: '가시적 학습 — Visible Learning',
    quote: '교육에서 가장 강력한 단일 요인은 피드백이다. 효과 크기 0.73.',
    insight: '80만 건의 연구를 메타분석한 결과, 피드백은 학습 효과를 가장 크게 높이는 요소입니다. 관리 = 체계적 피드백입니다.',
  },
  {
    icon: <BookOpen size={20} />,
    person: '레프 비고츠키 (Lev Vygotsky)',
    title: '근접발달영역 — ZPD',
    quote: '아이가 혼자 할 수 있는 것과, 도움을 받으면 할 수 있는 것 사이에 학습이 존재한다.',
    insight: '학생은 혼자서 성장에 한계가 있습니다. 관리자의 개입, 즉 스캐폴딩(비계)이 있을 때 비로소 도약합니다.',
  },
]

function AnimatedStat({ stat, visible }) {
  const count = useCountUp(stat.value * (stat.suffix === '배' ? 10 : 1), 1500, visible)
  const display = stat.suffix === '배'
    ? (count / 10).toFixed(1)
    : count

  return (
    <div className={`rounded-2xl p-5 border border-forest-100 bg-forest-50 card-lift stagger-item ${visible ? 'visible' : ''}`}>
      <div className="text-3xl font-black mb-1 counter-glow" style={{color:'#0d6e4b'}}>
        {display}{stat.suffix}
      </div>
      <div className="text-sm font-semibold text-slate-800 mb-1">{stat.label}</div>
      <div className="text-xs text-slate-500">{stat.sub}</div>
    </div>
  )
}

export default function Essential() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [statsRef, statsVisible] = useStaggerReveal(3, { stagger: 200 })
  const [theoryRef, theoryVisible] = useStaggerReveal(3, { stagger: 150 })
  const [quoteRef, quoteVisible] = useScrollReveal()
  const [featRef, featVisible] = useStaggerReveal(4, { stagger: 100 })

  return (
    <section id="essential" className="bg-white section-wrap">
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="kicker">챕터 01 — WHY: 왜 관리인가</span>

          <h2 className="display-lg text-slate-900 mb-6">
            관리는 선택이 아닙니다.<br />
            <span style={{color:'#0d6e4b'}}>학원 생존의 조건입니다.</span>
          </h2>

          <div className="divider-green" />

          <div className="space-y-6 body-lg mb-12">
            <p>
              학부모가 학원을 고르는 기준이 달라졌습니다.
              예전엔 "어느 강사가 가르치느냐"였지만, 지금은
              <strong className="text-slate-900"> "우리 아이를 얼마나 챙겨주느냐"</strong>입니다.
            </p>
            <p>
              단순히 수업을 듣는 것과, 수업 후에도 피드백을 받고 숙제를 점검받고
              부족한 부분을 보완받는 것은 완전히 다른 경험입니다.
              그 차이가 곧 성적의 차이이고, 재등록의 차이입니다.
            </p>
            <p>
              관리는 학원의 <em className="not-italic font-semibold text-slate-900">브랜드</em>입니다.
              입소문이 나는 학원에는 이유가 있습니다.
              학생을 '관리한다'는 평판 하나가 학원의 수십 년 역사보다 강합니다.
            </p>
          </div>
        </div>

        {/* Animated Stats */}
        <div ref={statsRef} className="grid sm:grid-cols-3 gap-4 mb-16">
          {stats.map((s, i) => (
            <AnimatedStat key={s.label} stat={s} visible={statsVisible.has(i)} />
          ))}
        </div>

        {/* Education Theory Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#f0fdf4', color:'#0d6e4b'}}>
              <BookOpen size={16} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">교육학이 이미 증명한 사실</h3>
          </div>
          <p className="text-sm text-slate-500 mb-6 ml-11">
            "관리가 중요하다"는 감(感)이 아닙니다. 수십 년간의 교육학 연구가 뒷받침하는 과학입니다.
          </p>

          <div ref={theoryRef} className="space-y-4">
            {theories.map((t, i) => (
              <div key={t.person} className={`rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-forest-200 transition-all card-lift stagger-item ${theoryVisible.has(i) ? 'visible' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#0d6e4b', color:'white'}}>
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.person}</div>
                    <div className="text-xs" style={{color:'#0d6e4b'}}>{t.title}</div>
                  </div>
                </div>
                <blockquote className="pl-4 mb-3" style={{borderLeft:'3px solid #0d6e4b'}}>
                  <p className="text-sm font-medium text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </blockquote>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {t.insight}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pull quote — John Dewey */}
        <div ref={quoteRef} className={`reveal-left ${quoteVisible ? 'visible' : ''}`}>
          <blockquote className="border-l-4 pl-6 py-2 mb-12" style={{borderColor:'#0d6e4b'}}>
            <p className="text-xl font-semibold text-slate-800 italic leading-relaxed">
              "교육은 삶을 위한 준비가 아니라, 삶 그 자체이다."
            </p>
            <footer className="text-sm text-slate-500 mt-3">— 존 듀이 (John Dewey), 미국 교육학의 아버지</footer>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              수업이 끝나면 학습도 끝나는 것이 아닙니다. 관리는 수업과 일상을 연결하는 다리입니다.
            </p>
          </blockquote>
        </div>

        {/* Feature bullets */}
        <div ref={featRef} className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: <TrendingUp size={20}/>, title: '성적 향상 가시화', desc: '관리받은 학생은 수치로 증명 가능한 성장을 경험합니다.' },
            { icon: <Users size={20}/>, title: '장기 재등록률 상승', desc: '체계적 관리가 신뢰를 만들고, 신뢰가 재등록으로 이어집니다.' },
            { icon: <Trophy size={20}/>, title: '학원 평판 구축', desc: '관리 잘 해준다는 입소문은 어떤 마케팅보다 강력합니다.' },
            { icon: <BarChart2 size={20}/>, title: '학부모 만족도 직결', desc: '피드백을 받은 학부모는 학원에 대한 투자를 아끼지 않습니다.' },
          ].map((item, i) => (
            <div key={item.title} className={`flex gap-4 p-4 rounded-xl bg-slate-50 card-lift stagger-item ${featVisible.has(i) ? 'visible' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-white border border-forest-100 flex items-center justify-center flex-shrink-0" style={{color:'#0d6e4b'}}>
                {item.icon}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm mb-1">{item.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
