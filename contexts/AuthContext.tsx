'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabaseClient, isSupabaseConfigured } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: string }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; role?: string }>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // If Supabase is not configured, don't try to use auth
  if (!isSupabaseConfigured || !supabaseClient) {
    const value = {
      user: null,
      profile: null,
      loading: false,
      signIn: async () => ({ error: new Error('Supabase not configured. Please set up environment variables.') }),
      signUp: async () => ({ error: new Error('Supabase not configured. Please set up environment variables.') }),
      signInWithGoogle: async () => ({ error: new Error('Supabase not configured. Please set up environment variables.') }),
      signOut: async () => {},
      isAdmin: false,
      isConfigured: false,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  }

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    if (!supabaseClient) return

    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      setProfile(null)
      return
    }

    setProfile(data)
  }

  // Initialize auth state
  useEffect(() => {
    if (!supabaseClient) {
      setLoading(false)
      return
    }

    // TypeScript knows supabaseClient is not null after the check above
    const client = supabaseClient

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await client.auth.getSession()
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sign in
  const signIn = async (email: string, password: string) => {
    if (!supabaseClient) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch role for redirect decision
      let role = 'user'
      if (authData.user) {
        const { data: profileData } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single()
        if (profileData?.role) role = profileData.role
      }

      return { error: null, role }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Sign up
  const signUp = async (email: string, password: string, fullName: string) => {
    if (!supabaseClient) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      // Create profile
      if (data.user) {
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'user', // Default role is user
          })

        if (profileError) throw profileError
      }

      return { error: null, role: 'user' }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!supabaseClient) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Sign out
  const signOut = async () => {
    if (!supabaseClient) return

    try {
      await supabaseClient.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isAdmin = profile?.role === 'admin'

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAdmin,
    isConfigured: true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
