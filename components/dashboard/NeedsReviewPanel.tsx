'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle } from 'lucide-react'
import type { Submission } from '@/lib/mockData'
import { findService } from '@/lib/services'
import { getAccent } from '@/lib/submission-display'

interface NeedsReviewPanelProps {
  submissions: Submission[]
}

export default function NeedsReviewPanel({ submissions }: NeedsReviewPanelProps) {
  const pending = submissions
    .filter((s) => s.status === 'Pending')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(0, 5)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 rounded-full bg-amber-400" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Needs review
        </h3>
        {pending.length > 0 && (
          <span className="ml-auto bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {pending.length}
          </span>
        )}
      </div>

      <div className="flex-1 p-5">
        {pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <AlertCircle size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 font-metropolis">
              Nothing waiting for review.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {pending.map((sub) => {
              const service = findService(sub.type)
              const accent = getAccent(sub.type)
              return (
                <li key={sub.id}>
                  <Link
                    href={`/dashboard/submissions?id=${sub.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <span
                      className="w-1 h-10 rounded-full flex-shrink-0"
                      style={{ background: accent.tileIcon }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-umak-blue font-metropolis truncate group-hover:text-umak-yellow transition-colors">
                        {service?.title || sub.type}
                      </p>
                      <p className="text-xs text-gray-500 font-metropolis truncate">
                        {sub.name} ·{' '}
                        {formatDistanceToNow(sub.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
