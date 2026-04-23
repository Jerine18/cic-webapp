'use client'

import { useMemo } from 'react'
import { TrendingDown, TrendingUp, Minus, Timer } from 'lucide-react'
import type { Submission } from '@/lib/mockData'

interface TurnaroundStatProps {
  submissions: Submission[]
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

function avgTurnaroundDays(rows: Submission[]): number | null {
  const completed = rows.filter((s) => s.status === 'Completed')
  if (completed.length === 0) return null
  const total = completed.reduce(
    (acc, s) => acc + (s.updatedAt.getTime() - s.createdAt.getTime()) / MS_PER_DAY,
    0,
  )
  return total / completed.length
}

export default function TurnaroundStat({ submissions }: TurnaroundStatProps) {
  const { current, previous } = useMemo(() => {
    const now = Date.now()
    const weekAgo = now - 7 * MS_PER_DAY
    const twoWeeksAgo = now - 14 * MS_PER_DAY

    const thisWeek = submissions.filter(
      (s) => s.updatedAt.getTime() >= weekAgo && s.updatedAt.getTime() <= now,
    )
    const lastWeek = submissions.filter(
      (s) =>
        s.updatedAt.getTime() >= twoWeeksAgo && s.updatedAt.getTime() < weekAgo,
    )

    return {
      current: avgTurnaroundDays(thisWeek),
      previous: avgTurnaroundDays(lastWeek),
    }
  }, [submissions])

  const delta =
    current !== null && previous !== null ? current - previous : null

  const TrendIcon =
    delta === null ? Minus : delta < 0 ? TrendingDown : delta > 0 ? TrendingUp : Minus
  const trendColor =
    delta === null
      ? 'text-gray-400'
      : delta < 0
        ? 'text-emerald-600'
        : delta > 0
          ? 'text-red-500'
          : 'text-gray-400'

  const valueLabel =
    current === null ? '—' : `${current.toFixed(1)} ${current === 1 ? 'day' : 'days'}`

  const trendLabel =
    delta === null
      ? 'No prior week data'
      : delta === 0
        ? 'Same as last week'
        : `${Math.abs(delta).toFixed(1)}d ${delta < 0 ? 'faster' : 'slower'} vs last week`

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
        <span className="block w-1 h-5 rounded-full bg-umak-blue" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Avg turnaround
        </h3>
      </div>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-umak-blue/10 flex items-center justify-center flex-shrink-0">
          <Timer size={22} className="text-umak-blue" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl font-marcellus text-umak-blue leading-none">
            {valueLabel}
          </p>
          <p
            className={`text-xs font-metropolis mt-1 flex items-center gap-1 ${trendColor}`}
          >
            <TrendIcon size={13} />
            <span>{trendLabel}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
