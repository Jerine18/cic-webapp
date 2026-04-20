'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Search, Inbox } from 'lucide-react'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { REQUEST_TYPES } from '@/lib/constants'
import UserPageHeader from '@/components/user/UserPageHeader'
import UserStatusBadge from '@/components/user/UserStatusBadge'

type StatusFilter = 'all' | 'Pending' | 'In Progress' | 'Completed'

interface SubmissionRow {
  id: string
  type: string
  details: string
  status: string
  priority?: string | null
  created_at: string
}

export default function UserMyRequestsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    (searchParams.get('status') as StatusFilter) || 'all',
  )

  useEffect(() => {
    async function load() {
      if (!user || !supabaseClient) {
        setLoading(false)
        return
      }
      const { data, error } = await supabaseClient
        .from('submissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (!error) setSubmissions((data || []) as SubmissionRow[])
      setLoading(false)
    }
    load()
  }, [user])

  const filtered = submissions.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false
    if (
      search &&
      !s.details?.toLowerCase().includes(search.toLowerCase()) &&
      !s.type?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false
    }
    return true
  })

  const getTypeLabel = (id: string) => REQUEST_TYPES.find((t) => t.id === id)?.label || id

  return (
    <div className="min-h-screen">
      <UserPageHeader title="My Requests" subtitle="View and track all your submissions." />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search your requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg font-metropolis text-sm focus:outline-none focus:border-umak-blue"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {(['all', 'Pending', 'In Progress', 'Completed'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-xs font-metropolis font-semibold uppercase tracking-wider transition-all ${
                  statusFilter === s
                    ? 'bg-umak-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push('/usersubmitrequest')}
            className="px-4 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold rounded-lg hover:bg-yellow-400 transition-all whitespace-nowrap"
          >
            + New Request
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 font-metropolis">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="font-marcellus text-xl text-gray-600 mb-2">No requests found</h3>
              <p className="font-metropolis text-sm text-gray-500 mb-4">
                {submissions.length === 0
                  ? "You haven't submitted any requests yet."
                  : 'Try adjusting your filters.'}
              </p>
              {submissions.length === 0 && (
                <button
                  onClick={() => router.push('/usersubmitrequest')}
                  className="px-6 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold rounded-lg hover:bg-yellow-400"
                >
                  Submit Your First Request
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 sm:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-marcellus text-lg text-umak-blue mb-1">
                        {getTypeLabel(sub.type)}
                      </h3>
                      <p className="text-sm text-gray-600 font-metropolis line-clamp-2">
                        {sub.details}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 font-metropolis">
                        <span>
                          Submitted {format(new Date(sub.created_at), 'MMM d, yyyy')}
                        </span>
                        {sub.priority && <span>Priority: {sub.priority}</span>}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <UserStatusBadge status={sub.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <p className="text-sm text-gray-500 font-metropolis text-center">
            Showing {filtered.length} of {submissions.length} requests
          </p>
        )}
      </div>
    </div>
  )
}
