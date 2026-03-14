export default function Story() {
  return (
    <section id="story" className="bg-white section-wrap">
      <div className="content-col">
        <span className="kicker">챕터 03 — 원장님의 하루</span>

        <h2 className="display-lg text-slate-900 mb-6">
          오늘도 퇴근하지 못한<br />
          <span style={{color:'#0d6e4b'}}>이 원장님 이야기.</span>
        </h2>

        <div className="divider-green" />

        {/* Narrative */}
        <div className="space-y-8 text-[17px] text-slate-600 leading-[1.85]">
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

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 my-2">
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

          <p>
            3개월 만에 모든 선생님들이 기피하는 업무가 됐습니다.
            관리를 하려다 오히려 운영이 더 복잡해진 것입니다.
          </p>

          <p>
            이 원장님은 지금도 생각합니다.
          </p>

          <div className="border-l-4 pl-6 py-1 my-2" style={{borderColor:'#10b981'}}>
            <p className="text-xl font-bold text-slate-900">
              "도구가 문제가 아니라, 처음부터 이걸 위해 만들어진 시스템이 필요했던 거야."
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
