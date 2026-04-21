'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  isLandingPage?: boolean
  isFormPage?: boolean
}

export default function Header({ isLandingPage = false, isFormPage = false }: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'services'>('home')
  const { user, profile, isConfigured } = useAuth()
  const pathname = usePathname()

  // Route the name link based on role: admin → admin dashboard, user → user portal
  const accountHref = profile?.role === 'admin' ? '/dashboard' : '/userpage'

  // Extract username from email (e.g., "jdiaz" from "jdiaz.a12240995@umak.edu.ph")
  const username = user?.email?.split('@')[0]?.split('.')[0] || ''

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      if (isLandingPage && window.scrollY < 200) setActiveSection('home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLandingPage])

  // Scroll-spy for #about and #services on the landing page
  useEffect(() => {
    if (!isLandingPage) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as 'about' | 'services')
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    ;['about', 'services'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isLandingPage])

  const isOnLanding = pathname === '/'
  const isHomeActive = isOnLanding && activeSection === 'home'
  const isAboutActive = isOnLanding && isLandingPage && activeSection === 'about'
  const isServicesActive = isOnLanding && isLandingPage && activeSection === 'services'

  const navLinkBase =
    'relative font-metropolis text-sm font-semibold transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:bg-umak-yellow after:transition-all after:duration-300 hover:after:w-full hover:text-umak-yellow'
  const navLinkClass = (active: boolean) =>
    `${navLinkBase} ${active ? 'text-umak-yellow after:w-full' : 'text-white after:w-0'}`
  const mobileLinkClass = (active: boolean) =>
    `block font-metropolis text-sm font-medium py-2 transition-colors ${
      active ? 'text-umak-yellow' : 'text-white hover:text-umak-yellow'
    }`

  const headerBg = scrolled
    ? 'bg-umak-blue/80 backdrop-blur-md shadow-lg'
    : 'bg-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logos */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.umak.edu.ph/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-14 h-14 flex-shrink-0"
            >
              <Image
                src="/images/UMak_Logo__White_R_1.png"
                alt="UMak Logo"
                fill
                className="object-contain"
              />
            </a>
            <div className="h-8 w-px bg-white/40" />
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault()
                  window.dispatchEvent(new CustomEvent('goToLanding'))
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="relative w-14 h-14 flex-shrink-0"
            >
              <Image
                src={isFormPage && !scrolled ? '/images/cic_logo_colored.png' : '/images/cic_logo.png'}
                alt="CIC Logo"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 mr-8">
              <Link href="/" className={navLinkClass(isHomeActive)}>Home</Link>
              {isLandingPage && (
                <>
                  <a
                    href="#about"
                    onClick={() => setActiveSection('about')}
                    className={navLinkClass(isAboutActive)}
                  >
                    About
                  </a>
                  <a
                    href="#services"
                    onClick={() => setActiveSection('services')}
                    className={navLinkClass(isServicesActive)}
                  >
                    Services
                  </a>
                </>
              )}
            </div>

            {isConfigured && user ? (
              <Link
                href={accountHref}
                className="px-6 py-2.5 bg-umak-yellow text-umak-blue rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all duration-300 border-2 border-umak-yellow hover:bg-transparent hover:text-umak-yellow hover:border-umak-yellow"
              >
                <User size={16} />
                {username}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-umak-yellow text-umak-blue rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider shadow-sm flex items-center gap-2 border-2 border-transparent transition-all duration-300 hover:bg-transparent hover:text-umak-yellow hover:border-umak-yellow hover:shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              >
                <User size={18} />
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-umak-yellow transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-umak-blue/95 backdrop-blur-md border-t border-white/10 py-4 space-y-3 px-2 rounded-b-xl">
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={mobileLinkClass(isHomeActive)}
            >
              Home
            </Link>
            {isLandingPage && (
              <>
                <a
                  href="#about"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setActiveSection('about')
                  }}
                  className={mobileLinkClass(isAboutActive)}
                >
                  About
                </a>
                <a
                  href="#services"
                  onClick={() => {
                    setIsMenuOpen(false)
                    setActiveSection('services')
                  }}
                  className={mobileLinkClass(isServicesActive)}
                >
                  Services
                </a>
              </>
            )}

            {isConfigured && user ? (
              <Link
                href={accountHref}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-umak-yellow text-umak-blue rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider transition-all duration-300 border-2 border-umak-yellow active:bg-transparent active:text-umak-yellow active:border-umak-yellow"
              >
                <User size={16} />
                {username}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-umak-yellow text-umak-blue rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider border-2 border-transparent transition-all duration-300 active:bg-transparent active:text-umak-yellow active:border-umak-yellow active:shadow-[0_0_15px_rgba(255,215,0,0.5)]"
              >
                <User size={18} />
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
