'use client'

import Link from 'next/link'
import { Menu, Search, Bell } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

interface DashboardHeaderProps {
  title: string
  subtitle?: string
}

export default function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="bg-white shadow-sm border-b-4 border-umak-yellow sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-umak-blue" />
        </button>

        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-marcellus text-umak-blue tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 mt-1 font-metropolis text-xs sm:text-sm font-normal">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search (decorative for now) */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-400 w-48 cursor-text">
              <Search className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-xs font-metropolis">Search submissions...</span>
            </div>

            {/* Notification bell */}
            <button
              className="relative p-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span
                className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
                aria-hidden="true"
              />
            </button>

            {/* View public site */}
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors whitespace-nowrap font-metropolis"
            >
              View public site ↗
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
