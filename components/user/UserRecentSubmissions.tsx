'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Inbox, Plus } from 'lucide-react'
import { REQUEST_TYPES } from '@/lib/constants'
import UserStatusBadge from './UserStatusBadge'

interface Submission {
  id: string
  type: string
  details: string
  status: string
  created_at: string
}

interface UserRecentSubmissionsProps {
  submissions: Submission[]
  loading?: boolean
}

function getTypeLabel(id: string) {
  return REQUEST_TYPES.find((t) => t.id === id)?.label || id
}

function truncate(text: string, max: number) {
  if (!text) return ''
  return text.length > max ? `${text.slice(0, max).trim()}...` : text
}

export default function UserRecentSubmissions({
  submissions,
  loading = false,
}: UserRecentSubmissionsProps) {
  const router = useRouter()

  return (
    <section className="bg-white rounded-xl border-t-4 border-umak-yellow shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="font-marcellus text-xl text-umak-blue">Recent Submissions</h2>
        <Link
          href="/usermyrequests"
          className="font-metropolis text-sm font-semibold text-umak-blue hover:text-umak-yellow transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      {loading ? (
        <div className="divide-y divide-gray-100">
          {[0, 1, 2].map((i) => (
            <div key={i} className="p-4 sm:p-6 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-64 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div className="p-12 text-center">
          <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="font-metropolis text-sm text-gray-600 mb-4">
            No submissions yet. Ready to submit your first request?
          </p>
          <button
            onClick={() => router.push('/usersubmitrequest')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-umak-yellow text-umak-blue font-metropolis font-bold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
          >
            <Plus size={16} />
            Submit Request
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {submissions.slice(0, 5).map((sub) => (
            <button
              key={sub.id}
              onClick={() => router.push('/usermyrequests')}
              className="w-full text-left p-4 sm:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-marcellus text-base text-umak-blue mb-1">
                    {getTypeLabel(sub.type)}
                  </p>
                  <p className="font-metropolis text-sm text-gray-600 truncate">
                    {truncate(sub.details, 60)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <UserStatusBadge status={sub.status} />
                  <span className="font-metropolis text-xs text-gray-500">
                    {format(new Date(sub.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
