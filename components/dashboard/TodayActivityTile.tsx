'use client'

import { useMemo } from 'react'
import { FileText, Loader2, CheckCircle2 } from 'lucide-react'
import type { Submission } from '@/lib/mockData'

interface TodayActivityTileProps {
  submissions: Submission[]
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export default function TodayActivityTile({ submissions }: TodayActivityTileProps) {
  const counts = useMemo(() => {
    const today = new Date()
    let submittedToday = 0
    let active = 0
    let completedToday = 0
    submissions.forEach((s) => {
      if (isSameDay(s.createdAt, today)) submittedToday += 1
      if (s.status === 'In Progress') active += 1
      if (s.status === 'Completed' && isSameDay(s.updatedAt, today)) {
        completedToday += 1
      }
    })
    return { submittedToday, active, completedToday }
  }, [submissions])

  const rows = [
    {
      icon: FileText,
      label: 'New today',
      value: counts.submittedToday,
      accent: '#FB923C',
    },
    {
      icon: Loader2,
      label: 'Active now',
      value: counts.active,
      accent: '#38BDF8',
    },
    {
      icon: CheckCircle2,
      label: 'Completed today',
      value: counts.completedToday,
      accent: '#4ADE80',
    },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 rounded-full bg-umak-yellow" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Today&apos;s activity
        </h3>
      </div>
      <div className="flex-1 p-5 space-y-4">
        {rows.map(({ icon: Icon, label, value, accent }) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${accent}22` }}
            >
              <Icon size={18} style={{ color: accent }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-metropolis">{label}</p>
              <p
                className="text-2xl font-marcellus leading-none"
                style={{ color: accent }}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
