'use client'

import { useRouter } from 'next/navigation'
import { FileText, Clock, Loader2, CheckCircle2, LucideIcon } from 'lucide-react'

interface Stats {
  total: number
  pending: number
  inProgress: number
  completed: number
}

interface UserDashboardStatsProps {
  stats: Stats
  loading?: boolean
}

interface Card {
  label: string
  value: number
  icon: LucideIcon
  sublabel: string
  filter: string | null
}

export default function UserDashboardStats({ stats, loading = false }: UserDashboardStatsProps) {
  const router = useRouter()

  const cards: Card[] = [
    { label: 'My Requests', value: stats.total, icon: FileText, sublabel: 'All submissions', filter: null },
    { label: 'Pending', value: stats.pending, icon: Clock, sublabel: 'Awaiting review', filter: 'Pending' },
    { label: 'In Progress', value: stats.inProgress, icon: Loader2, sublabel: 'Being worked on', filter: 'In Progress' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, sublabel: 'Done', filter: 'Completed' },
  ]

  const handleClick = (filter: string | null) => {
    const query = filter ? `?status=${encodeURIComponent(filter)}` : ''
    router.push(`/usermyrequests${query}`)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-umak-blue rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-8 w-8 bg-umak-blue-50 rounded mb-4" />
            <div className="h-3 w-20 bg-umak-blue-50 rounded mb-3" />
            <div className="h-10 w-16 bg-umak-blue-50 rounded mb-2" />
            <div className="h-3 w-24 bg-umak-blue-50 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <button
            key={card.label}
            onClick={() => handleClick(card.filter)}
            className="group bg-umak-blue rounded-xl p-6 shadow-sm text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <Icon size={28} className="text-umak-yellow mb-4" />
            <p className="text-xs uppercase tracking-wider text-gray-300 font-metropolis mb-2">
              {card.label}
            </p>
            <p className="text-5xl font-marcellus text-umak-yellow leading-none mb-2">
              {card.value}
            </p>
            <p className="text-xs text-gray-300 font-metropolis">{card.sublabel}</p>
          </button>
        )
      })}
    </div>
  )
}
