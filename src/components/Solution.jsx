import { Video, PenLine, ClipboardCheck, Bell, Layers, Shield } from 'lucide-react'

const features = [
  {
    icon: <Video size={26} />,
    title: '수업 녹화 & 자동 업로드',
    body: '수업이 끝나는 순간 녹화본이 자동으로 처리됩니다. 선생님이 별도로 파일을 옮기거나 링크를 공유할 필요가 없습니다. 학생은 수업 직후 앱에서 다시 볼 수 있습니다.',
    tag: '자동화',
  },
  {
    icon: <PenLine size={26} />,
    title: '필기 실시간 공유',
    body: '선생님이 판서하는 순간 학생 화면에 동시에 표시됩니다. 사진 촬영, 전송, 파일명 정리 등 모든 수작업이 사라집니다. 수업 중 필기를 놓친 학생도 나중에 복습할 수 있습니다.',
    tag: '실시간',
  },
  {
    icon: <ClipboardCheck size={26} />,
    title: '숙제 통합 관리',
    body: '출제·제출 확인·피드백이 하나의 화면에서 이루어집니다. 반별 제출률을 대시보드로 한눈에 파악하고, 미제출 학생에게 자동 알림이 발송됩니다.',
    tag: '통합',
  },
  {
    icon: <Bell size={26} />,
    title: '학부모 자동 알림',
    body: '오늘 수업 내용, 숙제 제출 여부, 선생님 피드백이 학부모 앱으로 자동 전달됩니다. 학부모가 먼저 물어보기 전에 정보가 도달합니다. 신뢰는 이런 작은 디테일에서 쌓입니다.',
    tag: '알림',
  },
  {
    icon: <Layers size={26} />,
    title: '올인원 — 별도 앱 없음',
    body: '카카오톡, 구글 드라이브, 줌, 엑셀. 지금 사용 중인 모든 관리 도구를 클래스인 하나로 대체합니다. 선생님도 학생도 학부모도 앱 하나만 씁니다.',
    tag: '올인원',
  },
  {
    icon: <Shield size={26} />,
    title: '학원 전용 하드웨어',
    body: '소프트웨어만이 아닙니다. 클래스인은 수업 최적화 전용 하드웨어와 함께 제공됩니다. 별도 장비 구매 없이, 설치 당일부터 바로 사용 가능합니다.',
    tag: '하드웨어',
  },
]

export default function Solution() {
  return (
    <section id="solution" className="bg-white section-wrap">
      <div className="content-col">
        <span className="kicker">챕터 05 — WHAT: 클래스인</span>

        <h2 className="display-lg text-slate-900 mb-4">
          클래스인.
        </h2>
        <p className="text-xl font-medium mb-6" style={{color:'#0d6e4b'}}>
          관리형 학원을 위해 처음부터 설계된 수업 통합 플랫폼.
        </p>

        <div className="divider-green" />

        <p className="body-lg mb-12">
          클래스인은 하드웨어와 소프트웨어를 함께 제공합니다.
          수업 시스템의 처음부터 끝까지, 단 하나의 플랫폼으로 완결됩니다.
        </p>
      </div>

      {/* Features — full width cards */}
      <div className="content-col">
        <div className="space-y-4">
          {features.map((f, i) => (
            <div key={f.title} className="flex gap-5 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-forest-200 hover:bg-forest-50 transition-colors group">
              <div className="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-forest-200 bg-white" style={{color:'#0d6e4b', borderColor:'#d1fae5'}}>
                {f.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-slate-900">{f.title}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border" style={{color:'#0d6e4b', borderColor:'#0d6e4b', background:'#f0fdf4'}}>
                    {f.tag}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
