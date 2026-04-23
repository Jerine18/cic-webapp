'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  FileText,
  Clock,
  Loader2,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import SubmissionsTable from '@/components/dashboard/SubmissionsTable'
import RequestsByType from '@/components/dashboard/RequestsByType'
import NeedsReviewPanel from '@/components/dashboard/NeedsReviewPanel'
import DueThisWeekPanel from '@/components/dashboard/DueThisWeekPanel'
import TodayActivityTile from '@/components/dashboard/TodayActivityTile'
import TeamWorkload from '@/components/dashboard/TeamWorkload'
import TurnaroundStat from '@/components/dashboard/TurnaroundStat'
import QuickActionsRow from '@/components/dashboard/QuickActionsRow'
import { supabaseClient } from '@/lib/supabase'
import { mockSubmissions, type Submission } from '@/lib/mockData'

interface StatCardData {
  label: string
  count: number
  sublabel: string
  href: string
  icon: LucideIcon
  accentColor: string
}

interface StatCardsProps {
  cards: StatCardData[]
}

function StatCards({ cards }: StatCardsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon
        const isHovered = hoveredIdx === idx
        return (
          <Link
            key={card.label}
            href={card.href}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            onFocus={() => setHoveredIdx(idx)}
            onBlur={() => setHoveredIdx(null)}
            className="group bg-umak-blue rounded-l-none rounded-r-xl p-6 text-left hover:-translate-y-1 transition-all duration-200 cursor-pointer block"
            style={{
              borderLeft: `8px solid ${card.accentColor}`,
              boxShadow: isHovered
                ? `0 18px 40px -10px ${card.accentColor}80, 0 8px 20px -8px ${card.accentColor}55`
                : '0 1px 2px 0 rgba(0,0,0,0.08)',
            }}
          >
            <Icon size={28} className="mb-4" style={{ color: card.accentColor }} />
            <p className="text-xs uppercase tracking-wider text-gray-300 font-metropolis mb-2">
              {card.label}
            </p>
            <p
              className="text-5xl font-marcellus leading-none mb-2"
              style={{ color: card.accentColor }}
            >
              {card.count}
            </p>
            <p className="text-xs text-gray-300 font-metropolis">{card.sublabel}</p>
          </Link>
        )
      })}
    </div>
  )
}

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSubmissions() {
      if (!supabaseClient) {
        setSubmissions(mockSubmissions)
        setLoading(false)
        return
      }
      const { data, error } = await supabaseClient
        .from('submissions')
        .select(
          'id, name, email, phone, details, type, priority, status, assignee, deadline, department, created_at, updated_at',
        )
        .order('created_at', { ascending: false })

      if (data) {
        setSubmissions(
          data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            name: row.name as string,
            email: row.email as string,
            phone: (row.phone as string | null) ?? undefined,
            details: (row.details as string) ?? '',
            type: row.type as Submission['type'],
            priority: row.priority as 'High' | 'Medium' | 'Low',
            status: row.status as 'Pending' | 'In Progress' | 'Completed',
            assignee: (row.assignee as string | null) ?? undefined,
            deadline: (row.deadline as string | null) ?? null,
            department: (row.department as string | null) ?? null,
            createdAt: new Date(row.created_at as string),
            updatedAt: row.updated_at
              ? new Date(row.updated_at as string)
              : new Date(row.created_at as string),
          })),
        )
      }
      if (error) {
        console.error('Failed to fetch submissions:', error)
        setSubmissions(mockSubmissions)
      }
      setLoading(false)
    }
    fetchSubmissions()
  }, [])

  const stats = useMemo(() => {
    const total = submissions.length
    const pending = submissions.filter((s) => s.status === 'Pending').length
    const inProgress = submissions.filter((s) => s.status === 'In Progress').length
    const completed = submissions.filter((s) => s.status === 'Completed').length
    return { total, pending, inProgress, completed }
  }, [submissions])

  // Approve = move Pending → In Progress (simple stub; wire to real workflow later).
  const handleApprove = async (id: string) => {
    const original = submissions
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'In Progress' } : s)),
    )
    if (!supabaseClient) return
    const { error } = await supabaseClient
      .from('submissions')
      .update({ status: 'In Progress' })
      .eq('id', id)
    if (error) {
      console.error('Approve failed:', error)
      setSubmissions(original)
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back — here's what's happening today."
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Alert banner */}
        {stats.pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-300 border-l-4 border-l-yellow-400 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm text-yellow-800 font-metropolis">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span className="flex-1">
              <strong className="font-bold">{stats.pending}</strong>{' '}
              {stats.pending === 1 ? 'submission is' : 'submissions are'} pending review
              — review{' '}
              {stats.pending === 1 ? 'it' : 'them'} now.
            </span>
            <Link
              href="/dashboard/submissions?status=Pending"
              className="font-semibold underline whitespace-nowrap hover:text-yellow-900"
            >
              Review now →
            </Link>
          </div>
        )}

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-umak-blue rounded-r-xl p-6 animate-pulse h-[168px]"
                style={{ borderLeft: '8px solid #A78BFA' }}
              />
            ))}
          </div>
        ) : (
          <StatCards
            cards={[
              {
                label: 'Total Requests',
                count: stats.total,
                sublabel: 'All submissions',
                href: '/dashboard/submissions',
                icon: FileText,
                accentColor: '#A78BFA',
              },
              {
                label: 'Pending Review',
                count: stats.pending,
                sublabel: 'Needs attention',
                href: '/dashboard/submissions?status=Pending',
                icon: Clock,
                accentColor: '#FB923C',
              },
              {
                label: 'In Progress',
                count: stats.inProgress,
                sublabel: 'Currently working',
                href: '/dashboard/submissions?status=In+Progress',
                icon: Loader2,
                accentColor: '#38BDF8',
              },
              {
                label: 'Completed',
                count: stats.completed,
                sublabel: 'Successfully done',
                href: '/dashboard/submissions?status=Completed',
                icon: CheckCircle2,
                accentColor: '#4ADE80',
              },
            ]}
          />
        )}

        {/* Actionable widgets row */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <NeedsReviewPanel submissions={submissions} />
            <DueThisWeekPanel submissions={submissions} />
            <TodayActivityTile submissions={submissions} />
          </div>
        )}

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6">
          <div className="min-w-0">
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 animate-pulse">
                <div className="h-4 w-40 bg-gray-200 rounded mb-4" />
                <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 rounded mb-2" />
                <div className="h-3 w-full bg-gray-100 rounded" />
              </div>
            ) : (
              <SubmissionsTable
                submissions={submissions}
                onApprove={handleApprove}
              />
            )}
          </div>
          <div className="space-y-6">
            <RequestsByType submissions={submissions} />
            {!loading && <TeamWorkload submissions={submissions} />}
          </div>
        </div>

        {/* Bottom row: avg turnaround + quick actions */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2fr] gap-4">
            <TurnaroundStat submissions={submissions} />
            <QuickActionsRow submissions={submissions} />
          </div>
        )}
      </div>
    </div>
  )
}
