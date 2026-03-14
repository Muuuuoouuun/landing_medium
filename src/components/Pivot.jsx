import { Sparkles, ArrowRight } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const before = [
  '수업 후 녹화 파일을 수동으로 업로드',
  '필기를 사진 찍어 카카오톡 전송',
  '숙제 현황 엑셀로 반별 따로 관리',
  '학부모 피드백은 전화 또는 문자',
  '선생님마다 관리 방식이 제각각',
]
const after = [
  '수업 종료 즉시 자동 녹화·업로드',
  '필기가 학생 화면에 실시간 공유',
  '숙제 출제·제출·피드백 한 화면',
  '학부모 앱에 자동 알림 발송',
  '플랫폼이 관리 방식을 표준화',
]

export default function Pivot() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [marzanoRef, marzanoVisible] = useScrollReveal()
  const [compareRef, compareVisible] = useScrollReveal()
  const [dweckRef, dweckVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()

  return (
    <section id="pivot" className="section-wrap section-transition" style={{background:'#f0fdf4', '--next-bg':'#ffffff'}}>
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="kicker">챕터 04 — HOW: 어떻게 해결하는가</span>

          <h2 className="display-lg text-slate-900 mb-6">
            시스템을 바꾸면<br />
            <span style={{color:'#0d6e4b'}}>관리가 자동이 됩니다.</span>
          </h2>

          <div className="divider-green" />

          <div className="space-y-5 body-lg mb-8">
            <p>
              관리가 힘든 이유는 <strong className="text-slate-900">도구가 관리를 위해 만들어지지 않았기 때문</strong>입니다.
              줌은 회의용, 구글 드라이브는 파일 공유용, 엑셀은 데이터 분석용입니다.
              이것들을 억지로 엮어서 쓰니 불편할 수밖에 없습니다.
            </p>
            <p>
              처음부터 <em className="not-italic font-semibold text-slate-900">학원의 수업 관리만을 위해 설계된 시스템</em>이라면 어떨까요?
              녹화, 필기 공유, 숙제 관리, 학부모 알림이 하나의 흐름으로 연결된다면?
            </p>
          </div>
        </div>

        {/* Marzano quote */}
        <div ref={marzanoRef} className={`reveal-left ${marzanoVisible ? 'visible' : ''}`}>
          <blockquote className="border-l-4 pl-6 py-2 mb-12" style={{borderColor:'#0d6e4b'}}>
            <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
              "형성평가와 즉각적 피드백이 있는 교실에서, 학생의 성취도는 26 퍼센타일 상승한다."
            </p>
            <footer className="text-sm text-slate-500 mt-3">
              — 로버트 마르자노 (Robert Marzano), 교육 효과성 연구
            </footer>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              시스템이 형성평가와 피드백을 자동화하면, 선생님은 가르치는 것에만 집중할 수 있습니다.
            </p>
          </blockquote>
        </div>

        {/* Before / After */}
        <div ref={compareRef} className={`grid sm:grid-cols-[1fr_auto_1fr] gap-4 items-start reveal-scale ${compareVisible ? 'visible' : ''}`}>
          <div className="rounded-2xl border border-red-100 bg-white p-5 card-lift">
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">지금까지</div>
            <ul className="space-y-3">
              {before.map(item => (
                <li key={item} className="flex gap-3 text-sm text-slate-600">
                  <span className="text-red-400 font-bold flex-shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden sm:flex items-center justify-center">
            <ArrowRight size={28} style={{color:'#0d6e4b'}} />
          </div>

          <div className="rounded-2xl border p-5 card-lift" style={{borderColor:'#0d6e4b', background:'#f0fdf4'}}>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{color:'#0d6e4b'}}>클래스인으로</div>
            <ul className="space-y-3">
              {after.map(item => (
                <li key={item} className="flex gap-3 text-sm text-slate-700">
                  <span className="font-bold flex-shrink-0" style={{color:'#0d6e4b'}}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Carol Dweck */}
        <div ref={dweckRef} className={`mt-10 rounded-2xl border border-forest-200 bg-white p-6 card-lift reveal ${dweckVisible ? 'visible' : ''}`}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:'#f0fdf4', color:'#0d6e4b'}}>
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 mb-1">
                캐롤 드웩 (Carol Dweck) — 성장 마인드셋
              </p>
              <p className="text-sm text-slate-600 italic mb-2">
                "능력은 고정된 것이 아니다. 올바른 전략과 피드백이 있으면 누구나 성장할 수 있다."
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                클래스인은 학생에게 "틀렸다"가 아닌 "여기를 보완하자"는 피드백을 체계적으로 전달합니다.
                성장 마인드셋은 시스템이 뒷받침할 때 비로소 교실에서 실현됩니다.
              </p>
            </div>
          </div>
        </div>

        <div ref={ctaRef} className={`mt-6 p-6 rounded-2xl text-white reveal-scale ${ctaVisible ? 'visible' : ''}`} style={{background:'linear-gradient(135deg, #0d6e4b, #0f8a5e)'}}>
          <div className="flex items-start gap-4">
            <Sparkles size={24} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-lg mb-1">클래스인을 도입한 학원의 변화</p>
              <p className="text-green-100 text-sm leading-relaxed">
                선생님들은 수업에만 집중하고, 관리는 시스템이 자동으로 처리합니다.
                학부모 만족도가 오르고, 원장님은 처음으로 제시간에 퇴근하게 됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
