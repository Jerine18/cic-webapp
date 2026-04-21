'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import AboutSection from '@/components/landing/AboutSection'
import WaveDivider from '@/components/landing/WaveDivider'
import PhotoStrip from '@/components/landing/PhotoStrip'
import Footer from '@/components/landing/Footer'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    const handleStartRequest = (event?: Event) => {
      if (!user) {
        router.push('/login')
        return
      }
      const serviceType = (event as CustomEvent)?.detail?.serviceType
      router.push(
        serviceType ? `/usersubmitrequest/${serviceType}` : '/usersubmitrequest',
      )
    }

    window.addEventListener('startRequest', handleStartRequest)
    return () => {
      window.removeEventListener('startRequest', handleStartRequest)
    }
  }, [user, router])

  return (
    <div className="min-h-screen" style={{ background: '#060e33' }}>
      <Header isLandingPage={true} />
      {/* Shared background for Hero + About */}
      <div className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/Main_Background.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(11,18,50,0.65) 0%, rgba(6,14,51,0.8) 50%, rgba(3,7,30,0.92) 100%)',
          }}
        />
        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
          <WaveDivider />
        </div>
      </div>
      <ServicesSection />
      <PhotoStrip />

      <Footer />
    </div>
  )
}
