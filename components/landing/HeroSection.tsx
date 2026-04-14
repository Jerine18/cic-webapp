'use client'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Title — vertically centered */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1
          className="text-[4rem] sm:text-[5rem] lg:text-[6.5rem] font-marcellus text-white mb-4 leading-none tracking-tight animate-glow-flicker"
        >
          CIC HUB
        </h1>
        <p
          className="text-lg sm:text-xl font-metropolis text-umak-yellow tracking-wider"
        >
          Center for Integrated Communication Hub
        </p>
      </div>
    </section>
  )
}
