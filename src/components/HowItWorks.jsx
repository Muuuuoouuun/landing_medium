import { PackageCheck, Settings2, PlayCircle, Headphones } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'

const steps = [
  {
    num: '01',
    icon: <PackageCheck size={26} />,
    title: '무료 상담 & 환경 분석',
    time: '1일 이내',
    desc: '현재 학원의 수업 구조, 강사 수, 반 편성을 파악합니다. 클래스인이 학원에 맞는지, 어떤 방식으로 도입할지 맞춤 플랜을 제안합니다.',
    voice: '"우리 학원은 좀 특수해서..." — 괜찮습니다. 그래서 상담이 먼저입니다.',
  },
  {
    num: '02',
    icon: <Settings2 size={26} />,
    title: '하드웨어 설치 & 세팅',
    time: '반나절',
    desc: '전담 엔지니어가 직접 방문하여 하드웨어를 설치합니다. 학원 반 구성, 강사·학생 계정 등록까지 모두 대행합니다.',
    voice: '원장님이 하실 일은 문을 열어주시는 것뿐입니다.',
  },
  {
    num: '03',
    icon: <PlayCircle size={26} />,
    title: '당일 수업 시작',
    desc: '설치 당일 바로 사용 가능합니다. 강사 교육 30분이면 모든 기능을 숙지할 수 있습니다.',
    time: '당일',
    voice: '"이거 진짜 30분이면 되나요?" — 네, 선생님들이 가장 놀라는 부분입니다.',
  },
  {
    num: '04',
    icon: <Headphones size={26} />,
    title: '2주 밀착 지원',
    time: '도입 후 2주',
    desc: '도입 초기 발생할 수 있는 모든 이슈를 전담 매니저가 실시간으로 지원합니다. 이후에도 정기 점검 서비스가 제공됩니다.',
    voice: '혼자 적응하실 필요 없습니다. 2주간 전담 매니저가 함께합니다.',
  },
]

export default function HowItWorksNew() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [quoteRef, quoteVisible] = useScrollReveal()
  const [stepsRef, stepsVisible] = useStaggerReveal(4, { stagger: 200 })
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <section id="features" className="section-wrap" style={{background:'#f8faf9'}}>
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="kicker">챕터 06 — 도입 프로세스</span>

          <h2 className="display-lg text-slate-900 mb-6">
            도입은 생각보다<br />
            <span style={{color:'#0d6e4b'}}>빠르고 간단합니다.</span>
          </h2>

          <div className="divider-green" />

          <p className="body-lg mb-6">
            설치 후 당일부터 수업에 사용 가능합니다.
            복잡한 IT 지식이나 별도의 준비물이 필요하지 않습니다.
          </p>
        </div>

        {/* Papert quote */}
        <div ref={quoteRef} className={`reveal-left ${quoteVisible ? 'visible' : ''}`}>
          <blockquote className="border-l-4 pl-6 py-2 mb-12" style={{borderColor:'#0d6e4b'}}>
            <p className="text-base font-semibold text-slate-800 italic leading-relaxed">
              "좋은 교육 도구는 낮은 문턱과 높은 천장을 가진다.
              시작은 쉽지만, 할 수 있는 것에는 한계가 없어야 한다."
            </p>
            <footer className="text-sm text-slate-500 mt-3">
              — 시모어 페퍼트 (Seymour Papert), MIT 미디어랩 창립 멤버
            </footer>
          </blockquote>
        </div>

        <div ref={stepsRef} className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.num} className={`relative flex gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm card-lift stagger-item ${stepsVisible.has(idx) ? 'visible' : ''}`}>
              {/* Connector */}
              {idx < steps.length - 1 && (
                <div className="absolute left-[43px] top-full h-4 w-px bg-slate-200 z-10" />
              )}

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white" style={{background:'linear-gradient(135deg, #0a1f17, #0d6e4b)'}}>
                {step.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-black tracking-widest" style={{color:'#0d6e4b'}}>{step.num}</span>
                  <span className="font-bold text-slate-900 text-lg">{step.title}</span>
                  <span className="ml-auto text-xs font-semibold px-3 py-1 rounded-full bg-forest-50 border border-forest-100" style={{color:'#0d6e4b'}}>
                    {step.time}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-2">{step.desc}</p>
                <p className="text-xs italic leading-relaxed" style={{color:'#0d6e4b'}}>
                  {step.voice}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary CTA */}
        <div ref={ctaRef} className={`mt-10 p-6 rounded-2xl text-center animate-glow-pulse reveal-scale ${ctaVisible ? 'visible' : ''}`} style={{background:'linear-gradient(135deg, #0d6e4b, #0f8a5e)'}}>
          <p className="text-white font-bold text-lg mb-2">
            상담부터 첫 수업까지, 최소 1일 — 최대 3일.
          </p>
          <p className="text-green-100 text-sm">
            도입을 고민하는 시간이 도입 자체보다 깁니다.
          </p>
        </div>
      </div>
    </section>
  )
}
