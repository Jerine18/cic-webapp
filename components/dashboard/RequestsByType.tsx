'use client'

import { useMemo } from 'react'
import type { Submission } from '@/lib/mockData'
import { SERVICES } from '@/lib/services'
import { getAccent } from '@/lib/submission-display'

interface RequestsByTypeProps {
  submissions: Submission[]
}

export default function RequestsByType({ submissions }: RequestsByTypeProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    submissions.forEach((s) => {
      map.set(s.type, (map.get(s.type) ?? 0) + 1)
    })
    return map
  }, [submissions])

  const max = useMemo(() => {
    let m = 0
    counts.forEach((v) => {
      if (v > m) m = v
    })
    return m
  }, [counts])

  const rows = SERVICES.map((service) => ({
    service,
    count: counts.get(service.serviceType) ?? 0,
  })).filter((row) => row.count > 0)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 bg-umak-blue rounded-full" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Requests by type
        </h3>
      </div>

      <div className="p-5">
        {rows.length === 0 ? (
          <p className="text-sm text-gray-500 font-metropolis">No data yet.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ service, count }) => {
              const accent = getAccent(service.serviceType)
              const widthPct = max > 0 ? Math.max(8, (count / max) * 100) : 0
              return (
                <li
                  key={service.serviceType}
                  className="flex items-center gap-3 text-sm font-metropolis"
                >
                  <span className="flex-1 text-umak-blue truncate">
                    {service.title}
                  </span>
                  <div className="w-[60px] h-1 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${widthPct}%`,
                        background: accent.tileIcon,
                      }}
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
