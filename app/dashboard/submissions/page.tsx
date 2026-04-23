'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import StatusBadge from '@/components/dashboard/StatusBadge'
import { supabaseClient } from '@/lib/supabase'
import { mockSubmissions, Submission } from '@/lib/mockData'
import { REQUEST_TYPES } from '@/lib/constants'

type StatusFilter = 'All' | 'Pending' | 'In Progress' | 'Completed'

function getTypeLabel(typeId: string): string {
  return REQUEST_TYPES.find((t) => t.id === typeId)?.label ?? typeId
}

function TableSkeletonRow() {
  return (
    <tr className="border-b border-gray-200">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse mt-2" />
        </td>
      ))}
    </tr>
  )
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All')

  useEffect(() => {
    let cancelled = false

    async function fetchSubmissions() {
      setLoading(true)

      if (!supabaseClient) {
        // Mock-data fallback: filter client-side since we have no DB to query.
        const filtered =
          filterStatus === 'All'
            ? mockSubmissions
            : mockSubmissions.filter((s) => s.status === filterStatus)
        if (!cancelled) {
          setSubmissions(filtered)
          setLoading(false)
        }
        return
      }

      let query = supabaseClient
        .from('submissions')
        .select(
          'id, name, email, phone, details, type, priority, status, assignee, deadline, department, created_at, updated_at',
        )
        .order('created_at', { ascending: false })

      if (filterStatus !== 'All') {
        query = query.eq('status', filterStatus)
      }

      const { data, error } = await query
      if (cancelled) return

      if (data) {
        setSubmissions(
          (data as Record<string, unknown>[]).map((row) => ({
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
    return () => {
      cancelled = true
    }
  }, [filterStatus])

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Request Submissions"
        subtitle={`${submissions.length} total request${submissions.length !== 1 ? 's' : ''} • Filter by status`}
      />

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <label className="text-sm font-semibold text-gray-700 font-metropolis whitespace-nowrap">
                Filter by status:
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
                className="w-full sm:w-auto px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue font-metropolis text-sm"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button className="bg-umak-yellow text-umak-blue px-8 py-3 rounded-lg hover:bg-umak-yellow-50 transition-colors font-bold font-metropolis shadow-md hover:shadow-lg">
              + New Request
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-umak-yellow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-umak-blue text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider">
                    Requestor Information
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold font-metropolis uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <TableSkeletonRow key={i} />
                    ))
                  : submissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className="hover:bg-blue-50 transition-colors border-b border-gray-200"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-gray-900 font-metropolis">
                            {submission.name}
                          </div>
                          <div className="text-xs text-gray-600 font-metropolis mt-1">
                            {submission.email}
                          </div>
                          {submission.phone && (
                            <div className="text-xs text-gray-500 font-metropolis mt-0.5">
                              {submission.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900 font-metropolis">
                            {getTypeLabel(submission.type)}
                          </div>
                          <div className="text-xs text-gray-500 font-metropolis mt-1 max-w-lg leading-relaxed">
                            {submission.details}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={submission.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 font-metropolis">
                          {submission.assignee || (
                            <span className="text-gray-400 italic font-normal">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900 font-metropolis">
                            {format(new Date(submission.createdAt), 'MMM d, yyyy')}
                          </div>
                          <div className="text-xs text-gray-500 font-metropolis mt-1">
                            {format(new Date(submission.createdAt), 'hh:mm a')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="px-3 py-1.5 text-xs font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded transition-colors font-metropolis">
                              VIEW
                            </button>
                            <button className="px-3 py-1.5 text-xs font-bold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white rounded transition-colors font-metropolis">
                              EDIT
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {!loading && submissions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 font-metropolis text-lg">
                No request submissions found matching your filter.
              </p>
              <p className="text-gray-500 font-metropolis text-sm mt-2">
                Try adjusting the status filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
