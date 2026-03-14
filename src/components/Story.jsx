import { TrendingUp, Clock, SmilePlus } from 'lucide-react'
import { useScrollReveal, useStaggerReveal } from '../hooks/useScrollReveal'

export default function Story() {
  const [headerRef, headerVisible] = useScrollReveal()
  const [failRef, failVisible] = useScrollReveal()
  const [epRef, epVisible] = useScrollReveal()
  const [statsRef, statsVisible] = useStaggerReveal(3, { stagger: 200 })
  const [closeRef, closeVisible] = useScrollReveal()

  return (
    <section id="story" className="bg-white section-wrap relative overflow-hidden">
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="kicker">챕터 03 — 원장님의 하루</span>

          <h2 className="display-lg text-slate-900 mb-6">
            오늘도 퇴근하지 못한<br />
            <span style={{color:'#0d6e4b'}}>이 원장님 이야기.</span>
          </h2>

          <div className="divider-green" />
        </div>

        {/* Narrative — Before */}
        <div className={`space-y-8 text-[17px] text-slate-600 leading-[1.85] reveal ${headerVisible ? 'visible' : ''}`}>
          <p>
            수도권 중형 학원을 운영하는 이민준 원장님(가명)의 하루는
            오전 9시에 시작됩니다.
            강사 회의, 수업 준비 점검, 밀린 학부모 카카오톡 답장...
            아직 오전인데 이미 진이 빠집니다.
          </p>

          <div className="border-l-4 pl-6 py-1 my-2" style={{borderColor:'#0d6e4b'}}>
            <p className="text-slate-800 font-medium">
              "3반 김준호 어머니가 또 연락이 왔어요. 아이가 숙제를 제대로 하고 있는지 모르겠다고.
              어제 수업 녹화 파일도 어디 올라가 있는지 모른다고..."
            </p>
          </div>

          <p>
            이 원장님은 알고 있습니다. <strong className="text-slate-900">관리가 답</strong>이라는 걸.
            각 학생의 숙제 현황을 파악하고, 수업 녹화를 공유하고,
            선생님이 남긴 피드백을 학부모에게 전달해야 한다는 걸.
          </p>

          <p>
            그래서 시도해 봤습니다.
            구글 드라이브에 수업 녹화를 올리고, 카카오톡 단체 채널로 숙제 공지를 보내고,
            엑셀 시트에 출석과 숙제 현황을 기록했습니다.
          </p>
        </div>

        <div ref={failRef} className={`bg-slate-50 rounded-2xl p-6 border border-slate-200 my-8 reveal-scale ${failVisible ? 'visible' : ''}`}>
          <p className="font-semibold text-slate-900 mb-4">결과는 어땠을까요?</p>
          <ul className="space-y-3 text-sm text-slate-600">
            {[
              '구글 드라이브 링크가 만료돼 학생들이 접근 못 함',
              '카카오톡 단체채널에 중요 공지가 잡담에 묻힘',
              '엑셀 파일을 3명의 선생님이 동시에 수정하다 꼬임',
              '학부모에게 개별 알림을 보낼 방법이 없어 모든 연락이 단방향',
              '선생님들은 퇴근 후에도 관련 메시지에 응답해야 했음',
            ].map(item => (
              <li key={item} className="flex gap-3 items-start">
                <span className="text-red-400 font-bold mt-0.5 flex-shrink-0">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8 text-[17px] text-slate-600 leading-[1.85]">
          <p>
            3개월 만에 모든 선생님들이 기피하는 업무가 됐습니다.
            관리를 하려다 오히려 운영이 더 복잡해진 것입니다.
          </p>

          <p>
            이 원장님은 그때 생각했습니다.
          </p>

          <div className="border-l-4 pl-6 py-1 my-2" style={{borderColor:'#10b981'}}>
            <p className="text-xl font-bold text-slate-900">
              "도구가 문제가 아니라, 처음부터 이걸 위해 만들어진 시스템이 필요했던 거야."
            </p>
          </div>
        </div>

        {/* Epilogue — After ClassIn */}
        <div className="mt-16 pt-12 border-t border-slate-100">
          <div ref={epRef} className={`reveal ${epVisible ? 'visible' : ''}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'#f0fdf4', color:'#0d6e4b'}}>
                <SmilePlus size={16} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">6개월 후, 이 원장님의 하루</h3>
            </div>

            <div className="space-y-8 text-[17px] text-slate-600 leading-[1.85]">
              <p>
                클래스인을 도입한 지 6개월.
                이민준 원장님의 하루는 여전히 오전 9시에 시작됩니다.
                하지만 <strong className="text-slate-900">끝나는 시간이 달라졌습니다.</strong>
              </p>

              <div className="border-l-4 pl-6 py-1 my-2" style={{borderColor:'#10b981'}}>
                <p className="text-slate-800 font-medium">
                  "오늘 수업 녹화? 자동으로 올라가 있고요. 숙제 미제출자?
                  시스템이 알아서 알림 보냈어요. 3반 김준호 어머님요?
                  요즘은 앱에서 직접 확인하시니까 연락이 거의 안 와요."
                </p>
              </div>

              <p>
                선생님들은 수업 준비에만 집중합니다.
                관리 업무가 줄어드니 오히려 수업의 질이 올라갔습니다.
                학부모 상담도 달라졌습니다.
                <strong className="text-slate-900">"아이 성적이 왜 이래요"가 아니라,
                "피드백 감사합니다"로 시작하는 대화</strong>가 늘었습니다.
              </p>

              <p>
                무엇보다, 이 원장님은 이제 <strong className="text-slate-900">저녁 7시에 퇴근</strong>합니다.
                집에서 아이와 저녁을 먹고, 다음 날의 경영 전략을 생각할 여유가 생겼습니다.
              </p>
            </div>
          </div>

          {/* Before/After Stats */}
          <div ref={statsRef} className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: <Clock size={18} />, label: '일일 관리 업무 시간', before: '4시간', after: '30분' },
              { icon: <TrendingUp size={18} />, label: '학부모 선제 문의', before: '하루 12건', after: '하루 2건' },
              { icon: <SmilePlus size={18} />, label: '강사 만족도', before: '보통', after: '매우 만족' },
            ].map((s, i) => (
              <div key={s.label} className={`rounded-2xl border border-forest-100 bg-forest-50 p-5 card-lift stagger-item ${statsVisible.has(i) ? 'visible' : ''}`}>
                <div className="flex items-center gap-2 mb-2" style={{color:'#0d6e4b'}}>
                  {s.icon}
                  <span className="text-xs font-bold">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-400 line-through">{s.before}</span>
                  <span className="text-slate-400">→</span>
                  <span className="text-lg font-black" style={{color:'#0d6e4b'}}>{s.after}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Closing quote */}
          <div ref={closeRef} className={`border-l-4 pl-6 py-2 mt-8 reveal-left ${closeVisible ? 'visible' : ''}`} style={{borderColor:'#10b981'}}>
            <p className="text-xl font-bold text-slate-900 leading-relaxed">
              "돌이켜보면, 클래스인은 단순히 도구를 바꾼 게 아니라<br className="hidden sm:block" />
              학원의 '일하는 방식'을 바꾼 거였어요."
            </p>
            <p className="text-sm text-slate-500 mt-2">— 이민준 원장님 (가명), 도입 6개월 후 인터뷰</p>
          </div>
        </div>
      </div>

      {/* Angled divider → Pivot section */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '70px',
          background: '#f0fdf4',
          clipPath: 'polygon(0 100%, 100% 30%, 100% 100%)',
        }}
      />
    </section>
  )
}
