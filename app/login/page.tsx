'use client'

import { Suspense, useState, useEffect } from 'react'
import Image from 'next/image'
import { LogIn, UserPlus } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import LoadingSpinner from '@/components/LoadingSpinner'
import SetupRequired from '@/components/SetupRequired'
import TypewriterHeading from '@/components/TypewriterHeading'

function LoginContent() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth()
  const [googleLoading, setGoogleLoading] = useState(false)

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) setError(decodeURIComponent(errorParam))
  }, [searchParams])

  // Show setup required if Supabase is not configured
  if (!isConfigured) {
    return <SetupRequired />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.endsWith('@umak.edu.ph')) {
      setError('Only UMak email addresses (@umak.edu.ph) are allowed.')
      return
    }

    setLoading(true)

    try {
      if (isSignUp) {
        const { error, role } = await signUp(email, password, fullName)
        if (error) {
          setError(error.message)
        } else {
          router.push(role === 'admin' ? '/dashboard' : '/userpage')
        }
      } else {
        const { error, role } = await signIn(email, password)
        if (error) {
          setError(error.message)
        } else {
          router.push(role === 'admin' ? '/dashboard' : '/userpage')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{ backgroundImage: "url('/images/Main_Background.jpg')" }}
        aria-hidden="true"
      />

      {/* Navy gradient overlay */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 26, 65, 0.85) 0%, rgba(0, 26, 65, 0.75) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Glassmorphism card */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-6 sm:p-8 md:p-10 rounded-2xl"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
        }}
      >
        {/* Back to Home */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-white/70 hover:text-[#FFD700] font-metropolis font-medium flex items-center gap-2 text-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/cic_logo.png"
            alt="CIC Logo"
            width={64}
            height={64}
            priority
            className="h-16 w-auto"
          />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          {isSignUp ? (
            <h1 className="font-marcellus text-4xl md:text-5xl text-white text-center min-h-[3.5rem] md:min-h-[4rem] mb-3">
              Create Account
            </h1>
          ) : (
            <TypewriterHeading
              phrases={['Welcome Back', 'Hello Again', 'Hi There']}
              typingSpeed={130}
              deletingSpeed={70}
              pauseAfterType={2200}
              className="font-marcellus text-4xl md:text-5xl text-white text-center min-h-[3.5rem] md:min-h-[4rem] mb-3"
            />
          )}
          <p className="text-white/70 text-sm font-metropolis">
            {isSignUp
              ? 'Sign up to access the dashboard'
              : 'Sign in to submit your request'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
            }}
          >
            <p className="text-red-100 text-sm font-metropolis">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-white/90 mb-2 font-metropolis"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required={isSignUp}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white placeholder-white/50 font-metropolis text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/90 mb-2 font-metropolis"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/50 font-metropolis text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              placeholder="student@umak.edu.ph"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/90 mb-2 font-metropolis"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-white placeholder-white/50 font-metropolis text-sm focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 transition-colors"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD700] text-[#001A41] border-2 border-[#FFD700] py-3 rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:bg-[#001A41] hover:text-[#FFD700] hover:border-[#FFD700] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:bg-[#FFD700] disabled:hover:text-[#001A41]"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-white/20" />
          <span className="px-4 text-white/50 text-xs uppercase tracking-widest font-metropolis">
            or continue with
          </span>
          <div className="flex-1 border-t border-white/20" />
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={async () => {
            setGoogleLoading(true)
            setError('')
            try {
              const { error } = await signInWithGoogle()
              if (error) setError(error.message)
            } catch (err) {
              setError('An unexpected error occurred')
            } finally {
              setGoogleLoading(false)
            }
          }}
          disabled={googleLoading}
          aria-label="Sign in with UMak Email"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-lg font-metropolis font-semibold text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
          onMouseEnter={(e) => {
            if (!googleLoading)
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
          }}
        >
          {googleLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <svg
                width="20"
                height="20"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with UMak Email
            </>
          )}
        </button>

        {/* Toggle Sign Up/Sign In */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
            }}
            className="text-sm text-white/70 font-metropolis font-medium"
          >
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span className="text-[#FFD700] hover:underline">Sign In</span>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <span className="text-[#FFD700] hover:underline">Sign Up</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginContent />
    </Suspense>
  )
}
