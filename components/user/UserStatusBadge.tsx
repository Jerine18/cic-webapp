'use client'

interface UserStatusBadgeProps {
  status: 'Pending' | 'In Progress' | 'Completed' | string
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config =
    {
      Pending: { bg: 'bg-umak-yellow', text: 'text-umak-blue', dot: 'bg-umak-blue' },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-600' },
      Completed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
    }[status] || { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' }

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-metropolis font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}
