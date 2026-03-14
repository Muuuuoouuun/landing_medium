import { PackageCheck, Settings2, PlayCircle, Headphones } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: <PackageCheck size={26} />,
    title: '무료 상담 & 환경 분석',
    time: '1일 이내',
    desc: '현재 학원의 수업 구조, 강사 수, 반 편성을 파악합니다. 클래스인이 학원에 맞는지, 어떤 방식으로 도입할지 맞춤 플랜을 제안합니다.',
  },
  {
    num: '02',
    icon: <Settings2 size={26} />,
    title: '하드웨어 설치 & 세팅',
    time: '반나절',
    desc: '전담 엔지니어가 직접 방문하여 하드웨어를 설치합니다. 학원 반 구성, 강사·학생 계정 등록까지 모두 대행합니다.',
  },
  {
    num: '03',
    icon: <PlayCircle size={26} />,
    title: '당일 수업 시작',
    desc: '설치 당일 바로 사용 가능합니다. 강사 교육 30분이면 모든 기능을 숙지할 수 있습니다.',
    time: '당일',
  },
  {
    num: '04',
    icon: <Headphones size={26} />,
    title: '2주 밀착 지원',
    time: '도입 후 2주',
    desc: '도입 초기 발생할 수 있는 모든 이슈를 전담 매니저가 실시간으로 지원합니다. 이후에도 정기 점검 서비스가 제공됩니다.',
  },
]

export default function HowItWorksNew() {
  return (
    <section id="features" className="section-wrap" style={{background:'#f8faf9'}}>
      <div className="content-col">
        <span className="kicker">챕터 06 — 도입 프로세스</span>

        <h2 className="display-lg text-slate-900 mb-6">
          도입은 생각보다<br />
          <span style={{color:'#0d6e4b'}}>빠르고 간단합니다.</span>
        </h2>

        <div className="divider-green" />

        <p className="body-lg mb-12">
          설치 후 당일부터 수업에 사용 가능합니다.
          복잡한 IT 지식이나 별도의 준비물이 필요하지 않습니다.
        </p>

        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative flex gap-6 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
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
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
