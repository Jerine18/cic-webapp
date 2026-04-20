'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Header from '@/components/Header'
import HeroSection from '@/components/landing/HeroSection'
import ServicesSection from '@/components/landing/ServicesSection'
import AboutSection from '@/components/landing/AboutSection'
import WaveDivider from '@/components/landing/WaveDivider'
import PhotoStrip from '@/components/landing/PhotoStrip'

import Footer from '@/components/landing/Footer'
import RequestForm from '@/components/RequestForm'
import { useRequestForm } from '@/hooks/useRequestForm'
import { REQUEST_TYPES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [showRequestForm, setShowRequestForm] = useState(false)
  const {
    selectedType,
    formData,
    errors,
    isSubmitting,
    handleTypeSelect,
    handleInputChange,
    handleSubmit,
    successMessage,
    clearSuccessMessage
  } = useRequestForm()

  useEffect(() => {
    const handleStartRequest = (event?: any) => {
      if (!user) {
        router.push('/login')
        return
      }

      const serviceType = event?.detail?.serviceType
      setShowRequestForm(true)

      if (serviceType) {
        handleTypeSelect(serviceType)
      }

      setTimeout(() => {
        const servicesSection = document.getElementById('services-form')
        servicesSection?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }

    const handleGoToLanding = () => {
      setShowRequestForm(false)
    }

    window.addEventListener('startRequest', handleStartRequest)
    window.addEventListener('goToLanding', handleGoToLanding)
    return () => {
      window.removeEventListener('startRequest', handleStartRequest)
      window.removeEventListener('goToLanding', handleGoToLanding)
    }
  }, [handleTypeSelect, user, router])

  // Safety net: if somehow on the form view without auth, kick back to login
  useEffect(() => {
    if (showRequestForm && !authLoading && !user) {
      setShowRequestForm(false)
      router.push('/login')
    }
  }, [showRequestForm, user, authLoading, router])

  // Handle a pending service type forwarded from the user portal
  useEffect(() => {
    if (authLoading) return
    const pending = sessionStorage.getItem('pendingServiceType')
    if (pending) {
      sessionStorage.removeItem('pendingServiceType')
      window.dispatchEvent(
        new CustomEvent('startRequest', { detail: { serviceType: pending } }),
      )
    }
  }, [authLoading, user])

  const handleFormCancel = () => {
    setShowRequestForm(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (showRequestForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Header isLandingPage={false} isFormPage={true} />
        <main id="services-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-5xl mx-auto">
            {successMessage ? (
              <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-500 p-6 sm:p-8 lg:p-12 text-center font-metropolis">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl sm:text-3xl font-marcellus text-umak-blue mb-4">
                  Request Submitted
                </h2>
                <p className="text-gray-600 font-metropolis text-sm sm:text-base mb-8">
                  {successMessage}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      clearSuccessMessage()
                    }}
                    className="px-6 py-3 bg-umak-blue text-white rounded-lg font-metropolis font-semibold text-sm uppercase tracking-wider hover:bg-blue-900 transition-colors"
                  >
                    Submit Another Request
                  </button>
                  <button
                    onClick={handleFormCancel}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-metropolis font-semibold text-sm uppercase tracking-wider hover:border-umak-blue hover:text-umak-blue transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg border-t-4 border-umak-yellow p-6 sm:p-8 lg:p-12">
                <div className="flex flex-col sm:flex-row items-start justify-between mb-8 sm:mb-10 pb-6 sm:pb-8 border-b-2 border-gray-100 gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-metropolis font-semibold text-gray-500 uppercase tracking-widest mb-2 sm:mb-3">
                      Request Form
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-marcellus text-umak-blue mb-3 sm:mb-4 leading-snug">
                      {REQUEST_TYPES.find(t => t.id === selectedType)?.label}
                    </h2>
                    <p className="text-gray-600 font-metropolis text-sm sm:text-base font-normal">
                      Complete all required fields to submit your request
                    </p>
                  </div>
                  <button
                    onClick={handleFormCancel}
                    className="text-gray-500 hover:text-umak-blue font-metropolis font-semibold text-xs uppercase tracking-wider flex items-center transition-colors whitespace-nowrap"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Back to Home</span>
                    <span className="sm:hidden">Back</span>
                  </button>
                </div>

                <RequestForm
                  formData={formData}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  onCancel={handleFormCancel}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    )
  }

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
