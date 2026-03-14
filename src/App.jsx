import { useState, useEffect } from 'react'
import JourneyTOC from './components/JourneyTOC'
import Opening from './components/Opening'
import Essential from './components/Essential'
import ButHard from './components/ButHard'
import Story from './components/Story'
import Pivot from './components/Pivot'
import Solution from './components/Solution'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Planning from './components/Planning'

function Footer() {
  return (
    <footer style={{background:'#020f08'}} className="border-t border-white/5">
      <div className="content-col section-wrap py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{background:'#0d6e4b'}}>
                C
              </div>
              <span className="font-bold text-white text-base">클래스인</span>
            </div>
            <p className="text-slate-500 text-xs">중형 관리형 학원을 위한 수업 시스템 통합 플랫폼</p>
          </div>
          <p className="text-slate-600 text-xs">© 2025 클래스인. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <JourneyTOC />
      <main>
        <Opening />
        <Essential />
        <ButHard />
        <Story />
        <Pivot />
        <Solution />
        <HowItWorks />
        <Testimonials />
        <Planning />
      </main>
      <Footer />
    </div>
  )
}
