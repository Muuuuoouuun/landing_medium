import { useState } from 'react'
import { Video, PenLine, ClipboardCheck, Bell, Layers, Shield } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'

const features = [
  {
    icon: <Video size={26} />,
    title: '수업 녹화 & 자동 업로드',
    body: '수업이 끝나는 순간 녹화본이 자동으로 처리됩니다. 선생님이 별도로 파일을 옮기거나 링크를 공유할 필요가 없습니다. 학생은 수업 직후 앱에서 다시 볼 수 있습니다.',
    tag: '자동화',
    story: '이 원장님은 매일 밤 구글 드라이브에 녹화 파일을 하나씩 올렸습니다. 이제 그 시간에 퇴근합니다.',
    color: '#0d6e4b',
  },
  {
    icon: <PenLine size={26} />,
    title: '필기 실시간 공유',
    body: '선생님이 판서하는 순간 학생 화면에 동시에 표시됩니다. 사진 촬영, 전송, 파일명 정리 등 모든 수작업이 사라집니다. 수업 중 필기를 놓친 학생도 나중에 복습할 수 있습니다.',
    tag: '실시간',
    story: '"선생님, 사진 다시 보내주세요" — 이 말을 더 이상 듣지 않게 됩니다.',
    color: '#0f8a5e',
  },
  {
    icon: <ClipboardCheck size={26} />,
    title: '숙제 통합 관리',
    body: '출제·제출 확인·피드백이 하나의 화면에서 이루어집니다. 반별 제출률을 대시보드로 한눈에 파악하고, 미제출 학생에게 자동 알림이 발송됩니다.',
    tag: '통합',
    story: '엑셀 시트 3개를 번갈아 열던 선생님이, 이제 화면 하나에서 모든 반을 봅니다.',
    color: '#10b981',
  },
  {
    icon: <Bell size={26} />,
    title: '학부모 자동 알림',
    body: '오늘 수업 내용, 숙제 제출 여부, 선생님 피드백이 학부모 앱으로 자동 전달됩니다. 학부모가 먼저 물어보기 전에 정보가 도달합니다. 신뢰는 이런 작은 디테일에서 쌓입니다.',
    tag: '알림',
    story: '김준호 어머니는 이제 먼저 전화하지 않습니다. 앱에서 직접 확인하니까요.',
    color: '#34d399',
  },
  {
    icon: <Layers size={26} />,
    title: '올인원 — 별도 앱 없음',
    body: '카카오톡, 구글 드라이브, 줌, 엑셀. 지금 사용 중인 모든 관리 도구를 클래스인 하나로 대체합니다. 선생님도 학생도 학부모도 앱 하나만 씁니다.',
    tag: '올인원',
    story: '4개의 앱을 오갈 때마다 10분씩 낭비됩니다. 하루 5번이면 50분. 1년이면 200시간.',
    color: '#0d6e4b',
  },
  {
    icon: <Shield size={26} />,
    title: '학원 전용 하드웨어',
    body: '소프트웨어만이 아닙니다. 클래스인은 수업 최적화 전용 하드웨어와 함께 제공됩니다. 별도 장비 구매 없이, 설치 당일부터 바로 사용 가능합니다.',
    tag: '하드웨어',
    story: '웹캠 각도 조절, 마이크 잡음... 수업 환경 고민이 사라집니다.',
    color: '#0f8a5e',
  },
]

export default function Solution() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [headerRef, headerVisible] = useScrollReveal()
  const [tabRef, tabVisible] = useScrollReveal()
  const [quoteRef, quoteVisible] = useScrollReveal()

  const active = features[activeIdx]

  return (
    <section id="solution" className="bg-white section-wrap">
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
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
      </div>

      {/* Tab-based Feature Explorer */}
      <div ref={tabRef} className={`content-col reveal ${tabVisible ? 'visible' : ''}`}>
        {/* Tab buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {features.map((f, i) => (
            <button
              key={f.title}
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                i === activeIdx
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              style={i === activeIdx ? { background: f.color } : {}}
            >
              {f.icon}
              <span className="hidden sm:inline">{f.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active feature detail */}
        <div key={activeIdx} className="rounded-2xl border border-slate-100 bg-slate-50 p-8 card-lift tab-content-enter" style={{borderColor: `${active.color}30`}}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white" style={{background: active.color}}>
              {active.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg">{active.title}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border" style={{color: active.color, borderColor: active.color, background:'#f0fdf4'}}>
                  {active.tag}
                </span>
              </div>
            </div>
          </div>

          <p className="text-base text-slate-600 leading-relaxed mb-4">{active.body}</p>

          <div className="rounded-xl p-4" style={{background: `${active.color}08`, borderLeft: `3px solid ${active.color}`}}>
            <p className="text-sm italic leading-relaxed" style={{color: active.color}}>
              {active.story}
            </p>
          </div>
        </div>

        {/* Feature dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {features.map((f, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                background: i === activeIdx ? active.color : '#e2e8f0',
                transform: i === activeIdx ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Siemens quote */}
        <div ref={quoteRef} className={`mt-10 rounded-2xl border border-slate-200 bg-white p-6 card-lift reveal ${quoteVisible ? 'visible' : ''}`}>
          <p className="text-sm text-slate-600 italic leading-relaxed">
            "21세기의 학습은 개인의 머릿속이 아니라, 연결된 네트워크 위에서 일어난다."
          </p>
          <p className="text-xs text-slate-500 mt-2">— 조지 시먼스 (George Siemens), 연결주의 학습이론</p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            학생·선생님·학부모가 하나의 플랫폼으로 연결될 때,
            관리는 '업무'가 아니라 '흐름'이 됩니다.
          </p>
        </div>
      </div>
    </section>
  )
}
