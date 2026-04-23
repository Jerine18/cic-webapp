'use client'

import Link from 'next/link'
import { Download, FileText, Image as ImageIcon } from 'lucide-react'
import type { Submission } from '@/lib/mockData'
import { findService } from '@/lib/services'

interface QuickActionsRowProps {
  submissions: Submission[]
}

function toCsv(rows: Submission[]): string {
  const header = [
    'id',
    'created_at',
    'name',
    'email',
    'office',
    'service',
    'status',
    'deadline',
    'details',
  ].join(',')
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    const needsQuote = /[",\n]/.test(s)
    const escaped = s.replace(/"/g, '""')
    return needsQuote ? `"${escaped}"` : escaped
  }
  const body = rows
    .map((r) =>
      [
        escape(r.id),
        escape(r.createdAt.toISOString()),
        escape(r.name),
        escape(r.email),
        escape(r.department ?? ''),
        escape(findService(r.type)?.title ?? r.type),
        escape(r.status),
        escape(r.deadline ?? ''),
        escape(r.details),
      ].join(','),
    )
    .join('\n')
  return `${header}\n${body}`
}

export default function QuickActionsRow({ submissions }: QuickActionsRowProps) {
  const handleExport = () => {
    const csv = toCsv(submissions)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cic-submissions-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="block w-1 h-5 rounded-full bg-umak-blue" />
        <h3 className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          Quick actions
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={submissions.length === 0}
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-umak-blue hover:bg-umak-blue/5 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-9 h-9 rounded-lg bg-umak-blue/10 flex items-center justify-center flex-shrink-0">
            <Download size={16} className="text-umak-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-umak-blue font-metropolis">
              Export CSV
            </p>
            <p className="text-xs text-gray-500 font-metropolis">
              All {submissions.length} submissions
            </p>
          </div>
        </button>

        <Link
          href="/dashboard/tools"
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-umak-blue hover:bg-umak-blue/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-umak-blue/10 flex items-center justify-center flex-shrink-0">
            <FileText size={16} className="text-umak-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-umak-blue font-metropolis">
              Generate certificate
            </p>
            <p className="text-xs text-gray-500 font-metropolis">
              Open the tools suite
            </p>
          </div>
        </Link>

        <Link
          href="/dashboard/photos"
          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-umak-blue hover:bg-umak-blue/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-umak-blue/10 flex items-center justify-center flex-shrink-0">
            <ImageIcon size={16} className="text-umak-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-umak-blue font-metropolis">
              Upload photos
            </p>
            <p className="text-xs text-gray-500 font-metropolis">
              Event documentation
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
