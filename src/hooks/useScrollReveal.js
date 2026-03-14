import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Intersection Observer 기반 스크롤 리빌 훅
 * @param {Object} options
 * @param {number} options.threshold - 트리거 비율 (0~1)
 * @param {string} options.rootMargin - root margin
 * @param {boolean} options.once - 한번만 트리거
 * @returns {[React.RefObject, boolean]}
 */
export function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isVisible]
}

/**
 * 여러 자식에 스태거 딜레이를 적용하는 훅
 * @param {number} count - 자식 갯수
 * @param {number} stagger - 각 아이템간 딜레이 ms
 */
export function useStaggerReveal(count, { threshold = 0.1, stagger = 100 } = {}) {
  const ref = useRef(null)
  const [visibleItems, setVisibleItems] = useState(new Set())

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 순차적으로 아이템 보이기
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems(prev => new Set([...prev, i]))
            }, i * stagger)
          }
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [count, threshold, stagger])

  return [ref, visibleItems]
}

/**
 * 숫자 카운트업 애니메이션 훅
 * @param {number} end - 목표 숫자
 * @param {number} duration - 애니메이션 기간 ms
 * @param {boolean} trigger - 시작 트리거
 */
export function useCountUp(end, duration = 1500, trigger = false) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let startTime = null
    let animFrame

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setValue(Math.floor(eased * end))

      if (progress < 1) {
        animFrame = requestAnimationFrame(step)
      }
    }

    animFrame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animFrame)
  }, [end, duration, trigger])

  return value
}
