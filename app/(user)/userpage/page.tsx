'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import UserPageHeader from '@/components/user/UserPageHeader'
import UserQuickActions from '@/components/user/UserQuickActions'
import UserDashboardStats from '@/components/user/UserDashboardStats'
import UserRecentSubmissions from '@/components/user/UserRecentSubmissions'

interface SubmissionRow {
  id: string
  type: string
  details: string
  status: string
  created_at: string
}

export default function UserDashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 })
  const [recent, setRecent] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user || !supabaseClient) {
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabaseClient
          .from('submissions')
          .select('id, type, details, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        const all = (data || []) as SubmissionRow[]
        setStats({
          total: all.length,
          pending: all.filter((s) => s.status === 'Pending').length,
          inProgress: all.filter((s) => s.status === 'In Progress').length,
          completed: all.filter((s) => s.status === 'Completed').length,
        })
        setRecent(all.slice(0, 5))
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen">
      <UserPageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Track your requests and submit new ones from here."
      />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <UserQuickActions />
        <UserDashboardStats stats={stats} loading={loading} />
        <UserRecentSubmissions submissions={recent} loading={loading} />
      </div>
    </div>
  )
}
