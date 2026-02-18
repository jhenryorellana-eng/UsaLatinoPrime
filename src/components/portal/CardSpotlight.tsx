'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface CardSpotlightProps {
  children: ReactNode
  cardCount: number
}

/**
 * Jewel Vitrine Spotlight — scroll-triggered cycling glow on service cards.
 *
 * When the grid scrolls into view the first time, it begins cycling
 * a `.spotlight-active` class across child cards every 3 seconds.
 * The class drives CSS animations (glow, shimmer sweep, elevation).
 *
 * Pauses when the user hovers any card (manual interaction takes priority)
 * and resumes 1 s after mouse-leave.
 */
export function CardSpotlight({ children, cardCount }: CardSpotlightProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Observe scroll into view — fire once
  useEffect(() => {
    const node = gridRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [started])

  // Cycling interval
  useEffect(() => {
    if (!started || paused || cardCount === 0) return

    // Immediately highlight first card
    setActiveIndex(0)

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cardCount)
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [started, paused, cardCount])

  // Apply / remove class on the actual DOM card elements
  useEffect(() => {
    const grid = gridRef.current
    if (!grid || activeIndex < 0) return

    const cards = grid.querySelectorAll<HTMLElement>('[data-spotlight-card]')
    cards.forEach((card, i) => {
      if (i === activeIndex) {
        card.classList.add('spotlight-active')
      } else {
        card.classList.remove('spotlight-active')
      }
    })
  }, [activeIndex])

  // Pause on hover, resume after leave
  const handleMouseEnter = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    setPaused(true)
    // Remove spotlight while hovering
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('[data-spotlight-card]')
    cards?.forEach((c) => c.classList.remove('spotlight-active'))
  }

  const handleMouseLeave = () => {
    resumeTimer.current = setTimeout(() => setPaused(false), 1000)
  }

  return (
    <div
      ref={gridRef}
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
