'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import type { Submission } from '@/lib/mockData'
import { SERVICES, findService } from '@/lib/services'
import { getAccent, formatSubmissionSummary } from '@/lib/submission-display'

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  'In Progress': { bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400' },
  Completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

interface SubmissionsTableProps {
  submissions: Submission[]
  onApprove?: (id: string) => void
}

export default function SubmissionsTable({ submissions, onApprove }: SubmissionsTableProps) {
  const [filter, setFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return submissions
    return submissions.filter((s) => s.type === filter)
  }, [submissions, filter])

  const filterOptions = [
    { value: 'all', label: 'All' },
    ...SERVICES.map((s) => ({ value: s.serviceType, label: s.title })),
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="block w-1 h-5 bg-umak-blue rounded-full" />
          <h2 className="font-metropolis font-bold text-umak-blue text-sm uppercase tracking-widest">
            Recent submissions
          </h2>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-2.5 py-1 rounded-full text-xs font-metropolis font-semibold transition-colors ${
                filter === opt.value
                  ? 'bg-umak-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/submissions"
          className="text-xs text-umak-blue hover:text-umak-yellow font-metropolis font-semibold whitespace-nowrap"
        >
          View all →
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500 font-metropolis">
            No submissions match the current filter.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <Th>Requestor</Th>
                <Th>Type</Th>
                <Th className="hidden lg:table-cell">Summary</Th>
                <Th>Status</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((sub) => {
                const service = findService(sub.type)
                const accent = getAccent(sub.type)
                const summary = formatSubmissionSummary(sub.type, sub.details)
                const status = STATUS_STYLES[sub.status] || STATUS_STYLES.Pending

                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    {/* Requestor */}
                    <td className="px-5 py-3 align-top">
                      <p className="text-sm font-semibold text-umak-blue font-metropolis truncate max-w-[220px]">
                        {sub.name}
                      </p>
                      <p className="text-xs text-gray-500 font-metropolis truncate max-w-[220px]">
                        {sub.email}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-3 align-top">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-metropolis font-medium"
                        style={{
                          background: accent.tileBg,
                          color: accent.tileIcon,
                        }}
                      >
                        {service?.title || sub.type}
                      </span>
                    </td>

                    {/* Summary */}
                    <td className="px-5 py-3 align-top hidden lg:table-cell max-w-[320px]">
                      <p className="text-sm text-umak-blue font-metropolis truncate">
                        {summary.primary || '—'}
                      </p>
                      {summary.secondary && (
                        <p className="text-xs text-gray-500 font-metropolis truncate mt-0.5">
                          {summary.secondary}
                        </p>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-metropolis font-semibold ${status.bg} ${status.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.dot}`}
                        />
                        {sub.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {sub.status === 'Pending' && onApprove && (
                          <button
                            onClick={() => onApprove(sub.id)}
                            className="px-2.5 py-1 text-xs font-metropolis font-semibold border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        <Link
                          href={`/dashboard/submissions?id=${sub.id}`}
                          className="px-2.5 py-1 text-xs font-metropolis font-semibold text-blue-600 hover:text-blue-800"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500 font-metropolis">
          Showing {filtered.length} of {submissions.length} · sorted by newest
        </div>
      )}
    </div>
  )
}

function Th({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <th
      className={`px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest font-metropolis ${className}`}
    >
      {children}
    </th>
  )
}

// Re-export format for use in other dashboard cells if needed.
export { format }
