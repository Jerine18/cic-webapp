'use client'

import { Menu } from 'lucide-react'

interface UserPageHeaderProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export default function UserPageHeader({ title, subtitle, onMenuClick }: UserPageHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b-4 border-umak-yellow sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-umak-blue" />
          </button>
        )}

        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-marcellus text-umak-blue truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 mt-1 font-metropolis text-xs sm:text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  )
}
