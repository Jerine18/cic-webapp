'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getDisplayName } from '@/lib/get-display-name'
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
        // Two parallel queries:
        //   1. a status-only pull for counting (cheap — one column, all rows)
        //   2. a capped pull for the Recent Submissions list (only what we
        //      actually render — 5 rows, five columns)
        const [statusesRes, recentRes] = await Promise.all([
          supabaseClient
            .from('submissions')
            .select('status')
            .eq('user_id', user.id),
          supabaseClient
            .from('submissions')
            .select('id, type, details, status, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5),
        ])

        if (statusesRes.error) throw statusesRes.error
        if (recentRes.error) throw recentRes.error

        const statuses = (statusesRes.data || []) as { status: string }[]
        setStats({
          total: statuses.length,
          pending: statuses.filter((s) => s.status === 'Pending').length,
          inProgress: statuses.filter((s) => s.status === 'In Progress').length,
          completed: statuses.filter((s) => s.status === 'Completed').length,
        })
        setRecent((recentRes.data || []) as SubmissionRow[])
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  const displayName = getDisplayName(user, profile)
  const firstNameRaw = displayName.split(/\s+/)[0] || 'there'
  // Normalise all-caps names like "JERINE CARL DIAZ" → "Jerine"
  const firstName =
    firstNameRaw === firstNameRaw.toUpperCase() && firstNameRaw.length > 1
      ? firstNameRaw.charAt(0) + firstNameRaw.slice(1).toLowerCase()
      : firstNameRaw

  return (
    <div className="min-h-screen">
      <UserPageHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Track your requests and submit new ones from here."
      />
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <UserQuickActions />
        <UserDashboardStats stats={stats} loading={loading} />
        <div className="pt-6">
          <UserRecentSubmissions submissions={recent} loading={loading} />
        </div>
      </div>
    </div>
  )
}
