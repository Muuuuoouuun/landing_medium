import { useState } from 'react'
import { Send, Phone, ChevronDown, CheckCircle } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'

const planOptions = [
  {
    id: 'consult',
    title: '무료 상담',
    badge: '추천',
    desc: '현재 학원 상황을 파악하고 맞춤 도입 플랜을 제안합니다. 비용과 일정을 명확하게 안내해 드립니다.',
    items: ['학원 환경 분석', '맞춤 도입 제안', '비용 안내', '설치 일정 확인'],
  },
  {
    id: 'demo',
    title: '데모 체험',
    badge: null,
    desc: '실제 클래스인 플랫폼을 원장님이 직접 체험해 보실 수 있습니다. 도입 전 확신을 가질 수 있습니다.',
    items: ['30분 라이브 데모', '강사/학생 화면 시연', 'Q&A', '현장 방문 또는 화상'],
  },
  {
    id: 'pilot',
    title: '한 반 먼저 적용',
    badge: '부담 ZERO',
    desc: '중등부 한 반만 먼저 적용해 결석 보강·녹화·상담 근거 흐름을 직접 확인합니다. 학원 전체를 한 번에 바꿀 필요가 없습니다.',
    items: ['중등부 한 반 파일럿', '결석 보강 흐름 진단', '2주 밀착 지원', '확인 후 확대 결정'],
  },
]

export default function Planning() {
  const [form, setForm] = useState({ name: '', phone: '', size: '', plan: 'consult', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [headerRef, headerVisible] = useScrollReveal()
  const [formRef, formVisible] = useScrollReveal()

  const planLabels = { consult: '무료 상담', demo: '데모 체험', pilot: '한 반 먼저 적용' }
  const currentLabel = planLabels[form.plan] || '무료 상담'

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    console.log('문의 접수:', form)
    setSubmitted(true)
  }

  return (
    <section id="planning" className="section-wrap" style={{background:'linear-gradient(160deg, #020f08 0%, #0a1f17 60%, #0d2b1e 100%)'}}>
      <div className="content-col">
        <div ref={headerRef} className={`reveal ${headerVisible ? 'visible' : ''}`}>
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 mb-5 rounded-full border" style={{color:'#34d399', borderColor:'#0d6e4b', background:'rgba(13,110,75,0.15)'}}>
            챕터 07 — 지금 시작하기
          </span>

          <h2 className="display-lg text-white mb-6">
            관리 시스템을<br />
            <span className="gradient-text">오늘 설계하세요.</span>
          </h2>

          <div className="w-12 h-1 rounded-full mb-8" style={{background:'#0d6e4b'}} />

          <p className="text-xl text-slate-300 leading-relaxed mb-12">
            지금 신청하시면 영업일 기준 1일 이내에 담당자가 연락드립니다.
            부담 없이 현재 상황만 말씀해 주세요.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {planOptions.map(plan => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
              className="text-left p-5 rounded-2xl border-2 transition-all duration-300 card-lift"
              style={form.plan === plan.id
                ? {borderColor:'#10b981', background:'rgba(13,110,75,0.2)'}
                : {borderColor:'rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)'}}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-white">{plan.title}</span>
                {plan.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{background:'#0d6e4b', color:'white'}}>
                    {plan.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{plan.desc}</p>
              <ul className="space-y-1">
                {plan.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs" style={{color:'#34d399'}}>
                    <CheckCircle size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <div ref={formRef} className={`reveal ${formVisible ? 'visible' : ''}`}>
          {submitted ? (
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow-pulse" style={{background:'rgba(13,110,75,0.3)'}}>
                <Send size={28} style={{color:'#34d399'}} />
              </div>
              <h3 className="font-bold text-xl text-white mb-2">신청이 완료됐습니다</h3>
              <p className="text-slate-400 text-sm">영업일 기준 1일 이내에 담당자가 연락드립니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 sm:p-8 shadow-2xl">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                {currentLabel} 신청
              </h3>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    담당자 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={form.name}
                    onChange={handleChange} required placeholder="홍길동"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-200 focus:border-forest-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel" name="phone" value={form.phone}
                    onChange={handleChange} required placeholder="010-0000-0000"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-200 focus:border-forest-500 transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  학원 규모 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="size" value={form.size} onChange={handleChange} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-forest-200 focus:border-forest-500 transition bg-white"
                  >
                    <option value="">선택해 주세요</option>
                    <option value="under50">50명 미만</option>
                    <option value="50to100">50 ~ 100명</option>
                    <option value="100to200">100 ~ 200명</option>
                    <option value="over200">200명 이상</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">문의 내용 (선택)</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} rows={3}
                  placeholder="현재 관리 방식이나 고민을 자유롭게 적어 주세요."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-200 focus:border-forest-500 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-base transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                style={{background:'#0d6e4b'}}
              >
                <Send size={18} />
                {currentLabel} 신청하기
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                제출 시 개인정보 처리방침에 동의한 것으로 간주됩니다.
              </p>
            </form>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 text-slate-400 text-sm">
          <Phone size={16} style={{color:'#34d399'}} />
          <span><strong className="text-white">02-000-0000</strong> · 평일 09:00–18:00</span>
        </div>
      </div>
    </section>
  )
}
