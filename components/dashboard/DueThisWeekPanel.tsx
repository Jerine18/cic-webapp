'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { format, differenceInCalendarDays } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { Submission } from '@/lib/mockData'
import { findService } from '@/lib/services'
import { getAccent, getEffectiveDueDate } from '@/lib/submission-display'

interface DueThisWeekPanelProps {
  submissions: Submission[]
}

export default function DueThisWeekPanel({ submissions }: DueThisWeekPanelProps) {
  const rows = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return submissions
      .filter((s) => s.status !== 'Completed')
      .map((s) => {
        const due = getEffectiveDueDate(s.type, s.details, s.deadline ?? null)
        return due ? { sub: s, dueDate: new Date(due) } : null
      })
      .filter((x): x is { sub: Submission; dueDate: Date } => !!x)
      .filter(({ dueDate }) => {
        const days = differenceInCalendarDays(dueDate, today)
        return days >= 0 && days <= 7
      })
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 5)
  }, [submissions])

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 rounded-full bg-sky-400" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Due this week
        </h3>
        {rows.length > 0 && (
          <span className="ml-auto bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {rows.length}
          </span>
        )}
      </div>

      <div className="flex-1 p-5">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <CalendarIcon size={28} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 font-metropolis">
              Nothing due in the next 7 days.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ sub, dueDate }) => {
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
                        {sub.name} · due {format(dueDate, 'EEE, MMM d')}
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
