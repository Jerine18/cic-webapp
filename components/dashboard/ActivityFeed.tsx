'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import type { Submission } from '@/lib/mockData'

interface ActivityFeedProps {
  submissions: Submission[]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

export default function ActivityFeed({ submissions }: ActivityFeedProps) {
  const recent = submissions.slice(0, 3)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-5 bg-umak-blue rounded-full" />
          <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
            Activity feed
          </h3>
        </div>
        <Link
          href="/dashboard/submissions"
          className="text-xs text-umak-blue hover:text-umak-yellow font-metropolis font-semibold"
        >
          See all
        </Link>
      </div>

      <div className="p-5">
        {recent.length === 0 ? (
          <p className="text-sm text-gray-500 font-metropolis">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {recent.map((sub) => (
              <li key={sub.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold font-metropolis flex-shrink-0">
                  {getInitials(sub.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-umak-blue font-metropolis leading-snug">
                    Request submitted by{' '}
                    <span className="font-semibold">{sub.name}</span>
                  </p>
                  <p className="text-xs text-gray-500 font-metropolis mt-0.5">
                    {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
