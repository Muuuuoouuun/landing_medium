import { AlertTriangle, Clock, Frown, MessageCircleWarning } from 'lucide-react'

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
  return (
    <section id="hard" className="section-wrap" style={{background:'#f8faf9'}}>
      <div className="content-col">
        <span className="kicker">챕터 02 — 현실의 벽</span>

        <h2 className="display-lg text-slate-900 mb-6">
          알면서도 못 한다.<br />
          <span style={{color:'#0d6e4b'}}>관리의 딜레마.</span>
        </h2>

        <div className="divider-green" />

        <div className="space-y-5 body-lg mb-12">
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

        <div className="space-y-4">
          {pains.map(p => (
            <div key={p.title} className="flex gap-5 p-6 rounded-2xl bg-white border border-red-100 shadow-sm">
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

        {/* Tension builder */}
        <div className="mt-12 p-6 rounded-2xl text-white" style={{background:'linear-gradient(135deg, #0a1f17, #0d2b1e)'}}>
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
