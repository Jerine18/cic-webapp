'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useAuth } from '@/contexts/AuthContext'
import { SERVICES } from '@/lib/services'

export default function ServicesSection() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)
  const { ref, isVisible } = useScrollAnimation(80)
  const router = useRouter()
  const { user } = useAuth()

  const handleRequestClick = (requestType?: string) => {
    if (!requestType) return
    if (!user) {
      router.push('/login')
      return
    }
    router.push(`/usersubmitrequest/${requestType}`)
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'coming-soon') {
      return (
        <span className="inline-block px-3 py-1 bg-umak-yellow/20 text-umak-yellow text-xs font-bold font-metropolis uppercase tracking-wider rounded-full border border-umak-yellow/30">
          Coming Soon
        </span>
      )
    }
    if (status === 'on-hold') {
      return (
        <span className="inline-block px-3 py-1 bg-orange-400/20 text-orange-200 text-xs font-bold font-metropolis uppercase tracking-wider rounded-full border border-orange-400/30">
          Temporarily On Hold
        </span>
      )
    }
    return null
  }

  return (
    <section
      id="services"
      className="relative py-16 lg:py-24"
      style={{ background: '#c4dfe8' }}
    >
      {/* Honeycomb pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpath d='M30 4L56 18V46L30 60L4 46V18Z' fill='none' stroke='%23a0c8d8' stroke-width='1.5'/%3E%3Cpath d='M30 64L56 78V106L30 120L4 106V78Z' fill='none' stroke='%23a0c8d8' stroke-width='1.5'/%3E%3C/svg%3E\")",
          backgroundSize: '60px 104px',
          opacity: 0.5,
        }}
      />

      <div
        ref={ref}
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Section heading */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-marcellus text-umak-blue mb-3">
            Services We Offer
          </h2>
          <div className="w-16 h-0.5 bg-umak-blue" />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {SERVICES.map((service) => {
            const isHovered = hoveredService === service.serviceType
            const Icon = service.icon
            return (
              <div
                key={service.serviceType}
                onMouseEnter={() => setHoveredService(service.serviceType)}
                onMouseLeave={() => setHoveredService(null)}
                className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ease-out ${
                  service.status !== 'available' ? 'opacity-70' : ''
                }`}
                style={{
                  background: '#001A41',
                  transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  border: isHovered ? '4px solid #FFD700' : '4px solid transparent',
                  boxShadow: isHovered
                    ? '0 20px 40px rgba(0, 26, 65, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                {/* Top half — Icon + Title */}
                <div className="px-8 pt-8 pb-6">
                  {/* Status badge */}
                  {getStatusBadge(service.status) && (
                    <div className="mb-4">{getStatusBadge(service.status)}</div>
                  )}

                  {/* Icon */}
                  <div className="mb-5">
                    <Icon
                      size={24}
                      strokeWidth={1.75}
                      className={`transition-colors duration-300 ${
                        isHovered ? 'text-umak-yellow' : 'text-white'
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-marcellus text-white leading-snug">
                    {service.title}
                  </h3>
                </div>

                {/* Divider */}
                <div className="mx-8">
                  <div
                    className="h-px transition-colors duration-300"
                    style={{ background: isHovered ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 255, 255, 0.12)' }}
                  />
                </div>

                {/* Bottom half — Description + Button */}
                <div className="px-8 pt-5 pb-8 flex flex-col flex-grow">
                  <p className="text-white/65 font-metropolis leading-relaxed text-sm flex-grow mb-6">
                    {service.description}
                  </p>

                  {/* Request button — always visible, left-aligned */}
                  {service.status === 'available' && (
                    <button
                      onClick={() => handleRequestClick(service.serviceType)}
                      className="self-start px-5 py-2 rounded-lg font-metropolis font-bold text-xs uppercase tracking-wider transition-all duration-300 border-2"
                      style={{
                        background: '#FFD700',
                        color: '#001A41',
                        borderColor: '#FFD700',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e6c200'
                        e.currentTarget.style.borderColor = '#e6c200'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#FFD700'
                        e.currentTarget.style.borderColor = '#FFD700'
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = '#FFD700'
                        e.currentTarget.style.borderColor = '#FFD700'
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.background = '#FFD700'
                        e.currentTarget.style.color = '#001A41'
                        e.currentTarget.style.borderColor = '#FFD700'
                      }}
                    >
                      Request
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
