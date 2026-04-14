'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation(80)

  return (
    <section id="about" className="py-24 lg:py-32">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${
          isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12'
        }`}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-marcellus text-umak-yellow mb-3 leading-tight">
          About Us
        </h2>
        <div className="w-16 h-0.5 bg-umak-yellow mb-10" />

        <p className="text-base text-white/75 font-metropolis leading-relaxed text-justify">
          The Center for Integrated Communications is the University&apos;s primary media and publications arm, implementing processes and policies that safeguard the UMak visual identity and brand. Working hand-in-hand with different units of the University and City Government of Makati, CIC facilitates, supports, and promotes university-wide initiatives and projects through professional creative services. Our core functions include content media management, visual identity and branding, facilitation of traditional and digital publications, involvement in university-wide initiatives, and visit management.
        </p>
      </div>
    </section>
  )
}
