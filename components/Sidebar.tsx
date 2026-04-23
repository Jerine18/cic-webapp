'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Calendar,
  Zap,
  Wrench,
  Image as ImageIcon,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'
import { useAuth } from '@/contexts/AuthContext'
import { supabaseClient } from '@/lib/supabase'

interface MenuItem {
  label: string
  href: string
  icon: LucideIcon
  badgeKey?: 'pending'
}

interface MenuSection {
  label: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      {
        label: 'Submissions',
        href: '/dashboard/submissions',
        icon: FileText,
        badgeKey: 'pending',
      },
      { label: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    ],
  },
  {
    label: 'Tools',
    items: [
      { label: 'Automation', href: '/dashboard/automation', icon: Zap },
      { label: 'Tools', href: '/dashboard/tools', icon: Wrench },
      { label: 'Photos', href: '/dashboard/photos', icon: ImageIcon },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Team', href: '/dashboard/team', icon: Users },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const { isOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [pendingCount, setPendingCount] = useState(0)

  // Live pending-count badge for the Submissions nav item.
  useEffect(() => {
    if (!supabaseClient) return
    let cancelled = false
    async function fetchPending() {
      const { count, error } = await supabaseClient!
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'Pending')
      if (!cancelled && !error && typeof count === 'number') {
        setPendingCount(count)
      }
    }
    fetchPending()
    const interval = setInterval(fetchPending, 60000) // refresh every minute
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  // Get user initials
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0].toUpperCase() || 'U'
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className="fixed left-0 top-0 h-screen bg-umak-blue text-white flex flex-col shadow-xl z-50 transition-all duration-300"
        style={{
          width: isOpen ? '256px' : '80px'
        }}
      >
        {/* Logo Section */}
        <div className={`p-6 border-b border-umak-blue-50 ${isOpen ? '' : 'px-4'}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 group ${isOpen ? '' : 'justify-center'}`}
            title="Back to landing page"
          >
            <div
              className={`relative flex-shrink-0 ${isOpen ? 'w-14 h-14' : 'w-12 h-12'}`}
            >
              <Image
                src="/images/cic_logo.png"
                alt="CIC Logo"
                fill
                className="object-contain"
              />
            </div>
            {isOpen && (
              <span className="font-marcellus text-lg text-umak-yellow whitespace-nowrap">
                Admin Portal
              </span>
            )}
          </Link>
        </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-8 h-8 lg:w-6 lg:h-6 bg-umak-yellow rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all shadow-md z-50"
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <ChevronLeft size={20} className="text-umak-blue lg:w-4 lg:h-4" />
        ) : (
          <ChevronRight size={20} className="text-umak-blue lg:w-4 lg:h-4" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuSections.map((section, sectionIdx) => (
          <div
            key={section.label}
            className={sectionIdx > 0 ? 'mt-4' : ''}
          >
            {isOpen && (
              <p className="text-[10px] uppercase tracking-widest text-white/40 px-6 mb-1 font-metropolis font-semibold">
                {section.label}
              </p>
            )}
            <div className="px-4 space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                const badge =
                  item.badgeKey === 'pending' && pendingCount > 0
                    ? pendingCount
                    : null

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-metropolis text-sm font-medium group ${
                      isActive
                        ? 'bg-umak-yellow text-umak-blue font-bold shadow-sm'
                        : 'text-gray-200 hover:bg-umak-blue-50 hover:text-white'
                    } ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive
                          ? ''
                          : 'group-hover:scale-110 transition-transform'
                      }`}
                    />
                    {isOpen && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {badge !== null && (
                          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-metropolis font-bold">
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                    {!isOpen && badge !== null && (
                      <span
                        className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
                        aria-label={`${badge} pending`}
                      />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className={`p-4 border-t border-umak-blue-50 ${isOpen ? '' : 'px-2'}`}>
        {isOpen ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-umak-yellow flex items-center justify-center text-umak-blue font-bold font-marcellus text-lg flex-shrink-0">
                {getInitials()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-metropolis truncate">
                  {profile?.full_name || user?.email || 'User'}
                </p>
                <p className="text-xs text-gray-300 font-metropolis">
                  {profile?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-3 w-full rounded-xl text-gray-200 hover:bg-red-600 hover:text-white transition-all font-metropolis"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-umak-yellow flex items-center justify-center text-umak-blue font-bold font-marcellus text-lg">
              {getInitials()}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center p-3 rounded-xl text-gray-200 hover:bg-red-600 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
