import { Star, Quote, CheckCircle2, Zap, Heart } from 'lucide-react'

const reviews = [
  {
    name: '김영진 원장님',
    academy: '수도권 · 영어 전문 학원 · 학생 120명',
    period: '도입 6개월',
    stars: 5,
    text: '클래스인 도입 전에는 매일 밤 11시까지 학원에 있었습니다. 숙제 확인, 학부모 카톡 응대, 녹화 파일 정리... 지금은 7시에 퇴근합니다. 시스템이 대신 해주니까요. 선생님들 만족도도 확 올랐고, 학부모 민원은 절반으로 줄었습니다.',
    highlight: '야근 4시간 → 정시 퇴근',
  },
  {
    name: '박수현 원장님',
    academy: '경기 · 수학 관리형 학원 · 학생 85명',
    period: '도입 4개월',
    stars: 5,
    text: '솔직히 처음엔 반신반의했어요. IT 도구라 어려울 줄 알았는데, 설치 당일부터 수업에 바로 썼습니다. 가장 좋은 건 학부모 앱이에요. 이제 학부모가 먼저 연락하는 일이 거의 없습니다. 피드백이 자동으로 가니까요.',
    highlight: '학부모 문의 70% 감소',
  },
  {
    name: '이준호 원장님',
    academy: '서울 · 국영수 종합 학원 · 학생 150명',
    period: '도입 8개월',
    stars: 5,
    text: '관리 시스템을 만들고 싶어서 노션, 구글 드라이브, 줌을 조합해서 3번 시도했다 3번 포기했습니다. 클래스인은 다릅니다. 처음부터 학원용으로 만들어졌으니 억지로 끼워맞출 필요가 없어요. 재등록률이 도입 전 대비 22% 올랐습니다.',
    highlight: '재등록률 22% 상승',
  },
]

const empowerments = [
  {
    icon: <Zap size={20} />,
    title: 'IT를 몰라도 됩니다',
    desc: '설치부터 세팅까지 전담 엔지니어가 모두 대행합니다. 원장님은 승인만 하시면 됩니다.',
  },
  {
    icon: <Heart size={20} />,
    title: '선생님 교육 30분이면 끝',
    desc: '직관적인 인터페이스 덕분에 별도의 매뉴얼이 필요 없습니다. 당일 수업부터 바로 사용 가능합니다.',
  },
  {
    icon: <CheckCircle2 size={20} />,
    title: '작은 학원도, 큰 학원도',
    desc: '50명 학원부터 200명 이상 학원까지. 학원 규모에 맞게 유연하게 구성됩니다.',
  },
]

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-wrap bg-white">
      <div className="content-col">
        <span className="kicker">후기 — 먼저 도입한 원장님들</span>

        <h2 className="display-lg text-slate-900 mb-6">
          이미 변화를 경험한<br />
          <span style={{color:'#0d6e4b'}}>원장님들의 이야기.</span>
        </h2>

        <div className="divider-green" />

        <p className="body-lg mb-12">
          클래스인을 먼저 도입한 원장님들이 전하는 솔직한 후기입니다.
        </p>

        {/* Review Cards */}
        <div className="space-y-5 mb-16">
          {reviews.map(r => (
            <div key={r.name} className="rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-forest-200 transition-colors">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-lg" style={{background:'linear-gradient(135deg, #0d6e4b, #10b981)'}}>
                  {r.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900">{r.name}</span>
                    <StarRating count={r.stars} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{r.academy} · {r.period}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap" style={{background:'#f0fdf4', color:'#0d6e4b', border:'1px solid #d1fae5'}}>
                  {r.highlight}
                </span>
              </div>

              <div className="relative pl-4" style={{borderLeft:'3px solid #e2e8f0'}}>
                <Quote size={16} className="absolute -left-2 -top-1 bg-slate-50 text-slate-300" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  {r.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Educator Quote — Paulo Freire */}
        <blockquote className="border-l-4 pl-6 py-2 mb-16" style={{borderColor:'#0d6e4b'}}>
          <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
            "교육의 목적은 현실을 변화시킬 수 있다는 믿음을 심어주는 것이다."
          </p>
          <footer className="text-sm text-slate-500 mt-3">
            — 파울로 프레이리 (Paulo Freire), 교육학자
          </footer>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            관리형 수업은 학생에게 "나도 할 수 있다"는 경험을 반복적으로 선물합니다.
            그 경험이 쌓이면, 학생은 스스로 공부하는 사람이 됩니다.
          </p>
        </blockquote>

        {/* "나도 할 수 있다" Empowerment Section */}
        <div className="rounded-2xl p-8 text-white" style={{background:'linear-gradient(160deg, #020f08 0%, #0a1f17 55%, #0d2b1e 100%)'}}>
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{color:'#34d399'}}>
              나도 할 수 있다
            </p>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
              복잡한 관리 시스템,<br />
              <span style={{color:'#34d399'}}>우리 학원도 할 수 있을까?</span>
            </h3>
            <p className="text-slate-300 text-base leading-relaxed max-w-lg mx-auto">
              할 수 있습니다. 아니, 클래스인은 원장님이 "하지 않아도 되게" 만들어졌습니다.
              시스템이 관리하고, 원장님은 경영에만 집중하세요.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {empowerments.map(e => (
              <div key={e.title} className="rounded-xl p-5 bg-white/[0.06] border border-white/10">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{background:'rgba(13,110,75,0.3)', color:'#34d399'}}>
                  {e.icon}
                </div>
                <div className="font-bold text-white text-sm mb-1">{e.title}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{e.desc}</p>
              </div>
            ))}
          </div>

          {/* Final encouragement with Dweck */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-slate-300 italic leading-relaxed max-w-lg mx-auto">
              "도전하는 과정 자체를 즐기는 사람이 결국 성공한다."
            </p>
            <p className="text-xs text-slate-500 mt-2">— 캐롤 드웩 (Carol Dweck)</p>
            <p className="text-xs mt-3" style={{color:'#34d399'}}>
              첫 걸음은 무료 상담 한 번이면 충분합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
