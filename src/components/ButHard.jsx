import { AlertTriangle, Clock, Frown, MessageCircleWarning } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'

const pains = [
  {
    icon: <Clock size={22} />,
    title: '시간이 없다',
    body: '수업 준비, 강사 관리, 학부모 상담까지. 관리를 제대로 하고 싶어도 하루 24시간이 턱없이 부족합니다. 관리를 위한 "시간 투자" 자체가 또 하나의 짐이 됩니다.',
  },
  {
    icon: <Frown size={22} />,
    title: '툴이 너무 많다',
    body: '수업 녹화는 줌, 필기 공유는 노션, 숙제 관리는 카카오톡, 출결은 엑셀... 흩어진 도구들을 오가다 보면 정작 중요한 피드백을 놓칩니다. 연동도 안 되고, 학생도 헷갈립니다.',
  },
  {
    icon: <AlertTriangle size={22} />,
    title: '일관성이 없다',
    body: '선생님마다 관리 방식이 다릅니다. 어떤 반은 꼼꼼히 챙기고, 어떤 반은 숙제 확인도 안 됩니다. 학원 전체의 관리 수준을 균일하게 유지하는 것이 불가능에 가깝습니다.',
  },
  {
    icon: <MessageCircleWarning size={22} />,
    title: '학부모 소통이 단절된다',
    body: '우리 아이가 어떻게 공부하고 있는지 학부모는 알 수 없습니다. 결과만 보고 판단하다 결국 불만이 쌓이고, 갑작스러운 퇴원으로 이어집니다.',
  },
]

export default function ButHard() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [quoteRef, quoteVisible] = useScrollReveal()
  const [painsRef, painsVisible] = useStaggerReveal(4, { stagger: 150 })
  const [brunerRef, brunerVisible] = useScrollReveal()
  const [tensionRef, tensionVisible] = useScrollReveal()

  return (
    <section id="hard" className="section-wrap section-transition" style={{background:'#f8faf9', '--next-bg':'#ffffff'}}>
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="kicker">챕터 02 — 현실의 벽</span>

          <h2 className="display-lg text-slate-900 mb-6">
            알면서도 못 한다.<br />
            <span style={{color:'#0d6e4b'}}>관리의 딜레마.</span>
          </h2>

          <div className="divider-green" />
        </div>

        {/* Knowles quote */}
        <div ref={quoteRef} className={`reveal-left ${quoteVisible ? 'visible' : ''}`}>
          <blockquote className="border-l-4 pl-6 py-2 mb-10" style={{borderColor:'#0d6e4b'}}>
            <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
              "성인 학습자에게는 이론이 아니라 실행 가능한 도구가 필요하다."
            </p>
            <footer className="text-sm text-slate-500 mt-3">
              — 말콤 노울즈 (Malcolm Knowles), 성인교육학(Andragogy)의 창시자
            </footer>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              원장님과 선생님도 마찬가지입니다. "관리해야 한다"는 교육만으로는 부족합니다.
              실행할 수 있는 도구가 뒷받침되지 않으면, 아무리 좋은 의지도 좌절됩니다.
            </p>
          </blockquote>
        </div>

        <div className={`space-y-5 body-lg mb-12 reveal ${headerVisible ? 'visible' : ''}`}>
          <p>
            관리가 중요하다는 사실, 원장님은 이미 알고 있습니다.
            하지만 <strong className="text-slate-900">아는 것과 실행하는 것 사이엔 거대한 벽</strong>이 있습니다.
          </p>
          <p>
            그 벽은 게으름이 아닙니다. 시스템의 부재입니다.
            제대로 된 도구 없이 관리를 시도하면, 오히려 선생님도 지치고
            학생도 혼란스러워집니다.
          </p>
          <p>
            많은 원장님이 이 딜레마에서 결국 포기를 선택합니다.
            <em className="not-italic font-semibold text-slate-900">
              "우리 학원 규모에선 어렵다"
            </em>
            는 결론에 도달하게 되는 것입니다.
          </p>
        </div>

        <div ref={painsRef} className="space-y-4">
          {pains.map((p, i) => (
            <div key={p.title} className={`flex gap-5 p-6 rounded-2xl bg-white border border-red-100 shadow-sm card-lift stagger-item ${painsVisible.has(i) ? 'visible' : ''}`}>
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500 mt-0.5">
                {p.icon}
              </div>
              <div>
                <div className="font-bold text-slate-900 text-base mb-2">{p.title}</div>
                <div className="text-sm text-slate-500 leading-relaxed">{p.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bruner quote */}
        <div ref={brunerRef} className={`mt-8 rounded-2xl border border-slate-200 bg-white p-6 card-lift reveal-scale ${brunerVisible ? 'visible' : ''}`}>
          <p className="text-sm text-slate-600 italic leading-relaxed">
            "어떤 교과목이든, 지적으로 올바른 형태로 표현하면
            어떤 발달 단계의 아이에게든 효과적으로 가르칠 수 있다."
          </p>
          <p className="text-xs text-slate-500 mt-2">— 제롬 브루너 (Jerome Bruner), 발견학습 이론</p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            문제는 '관리를 할 수 있느냐'가 아닙니다.
            관리를 <strong className="text-slate-600">'올바른 형태'</strong>로 실행할 도구가 있느냐입니다.
          </p>
        </div>

        {/* Tension builder */}
        <div ref={tensionRef} className={`mt-8 p-6 rounded-2xl text-white reveal-scale ${tensionVisible ? 'visible' : ''}`} style={{background:'linear-gradient(135deg, #0a1f17, #0d2b1e)'}}>
          <p className="text-lg font-semibold leading-relaxed">
            관리하지 않으면 학원이 성장하지 못하고,<br />
            관리하려면 시간과 시스템이 필요합니다.
          </p>
          <p className="text-forest-400 text-sm mt-3 font-medium">
            이 악순환에서 벗어나는 방법이 있을까요?
          </p>
        </div>
      </div>
    </section>
  )
}
