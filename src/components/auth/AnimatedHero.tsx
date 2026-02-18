'use client'

import { useEffect, useState } from 'react'

const slogans = [
  'Empieza a cambiar tu vida hoy',
  'Tu sueño americano comienza aquí',
  'Regularízate con confianza',
]

export function AnimatedHero() {
  const [mounted, setMounted] = useState(false)
  const [sloganIndex, setSloganIndex] = useState(0)
  const [sloganVisible, setSloganVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganVisible(false)
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length)
        setSloganVisible(true)
      }, 500)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center mb-8 select-none">
      {/* Stars / sparkles decoration */}
      <div className="relative inline-block">
        <span className="auth-sparkle auth-sparkle-1">✦</span>
        <span className="auth-sparkle auth-sparkle-2">✦</span>
        <span className="auth-sparkle auth-sparkle-3">★</span>

        {/* Main title */}
        <h1 className="relative">
          <span
            className={`inline-block text-4xl sm:text-5xl font-black tracking-tight transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="auth-title-usa">Usa</span>
            <span className="auth-title-latino">Latino</span>
            <span className="auth-title-prime">Prime</span>
          </span>
        </h1>

        {/* Gold underline animated */}
        <div
          className={`mx-auto mt-2 h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#F2A900] to-transparent transition-all duration-1000 delay-500 ${
            mounted ? 'w-full opacity-100' : 'w-0 opacity-0'
          }`}
        />
      </div>

      {/* Rotating slogan */}
      <p
        className={`mt-4 text-lg sm:text-xl font-medium text-blue-100 transition-all duration-500 min-h-[2rem] ${
          sloganVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {slogans[sloganIndex]}
      </p>

      {/* Subtitle */}
      <p
        className={`mt-2 text-sm text-blue-300/70 tracking-wide uppercase transition-all duration-700 delay-700 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Portal de Servicios Migratorios
      </p>
    </div>
  )
}
