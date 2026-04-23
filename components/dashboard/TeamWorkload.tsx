'use client'

import { useMemo } from 'react'
import { Users } from 'lucide-react'
import type { Submission } from '@/lib/mockData'

interface TeamWorkloadProps {
  submissions: Submission[]
}

const PALETTE = ['#A78BFA', '#FB923C', '#38BDF8', '#4ADE80', '#F472B6', '#2DD4BF']

export default function TeamWorkload({ submissions }: TeamWorkloadProps) {
  const rows = useMemo(() => {
    const active = submissions.filter((s) => s.status !== 'Completed')
    const map = new Map<string, number>()
    active.forEach((s) => {
      const key = s.assignee?.trim() || 'Unassigned'
      map.set(key, (map.get(key) ?? 0) + 1)
    })
    const entries = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
    const max = entries.reduce((m, [, v]) => Math.max(m, v), 0)
    return { entries, max }
  }, [submissions])

  const hasAssignees = rows.entries.some(([name]) => name !== 'Unassigned')

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 rounded-full bg-umak-blue" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Team workload
        </h3>
      </div>

      <div className="p-5">
        {!hasAssignees ? (
          <div className="flex items-start gap-3 text-sm text-gray-500 font-metropolis">
            <Users size={18} className="text-gray-300 flex-shrink-0 mt-0.5" />
            <div>
              <p>No assignees set yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Assign submissions to a team member to see load here.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.entries.map(([name, count], idx) => {
              const widthPct = rows.max > 0 ? Math.max(8, (count / rows.max) * 100) : 0
              const color = PALETTE[idx % PALETTE.length]
              return (
                <li
                  key={name}
                  className="flex items-center gap-3 text-sm font-metropolis"
                >
                  <span className="flex-1 text-umak-blue truncate">{name}</span>
                  <div className="w-[80px] h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${widthPct}%`, background: color }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-500 w-6 text-right">
                    {count}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
