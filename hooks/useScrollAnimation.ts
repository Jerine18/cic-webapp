'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollAnimation(offset = 100) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      {
        threshold: 0,
        rootMargin: `-${offset}px 0px`,
      }
    )

    observer.observe(el)

    // Fallback: if the element is already in the viewport, show it
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsVisible(true)
    }

    return () => observer.disconnect()
  }, [offset])

  return { ref, isVisible }
}
