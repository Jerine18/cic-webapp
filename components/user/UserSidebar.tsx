'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LogOut,
  LayoutDashboard,
  PlusCircle,
  ListChecks,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface UserSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  { label: 'Dashboard', href: '/userpage', icon: LayoutDashboard },
  { label: 'Submit Request', href: '/usersubmitrequest', icon: PlusCircle },
  { label: 'My Requests', href: '/usermyrequests', icon: ListChecks },
]

export default function UserSidebar({ isOpen, onToggle }: UserSidebarProps) {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return user?.email?.[0].toUpperCase() || 'U'
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className="fixed left-0 top-0 h-screen bg-umak-blue text-white flex flex-col shadow-xl z-50 transition-all duration-300"
        style={{ width: isOpen ? '256px' : '80px' }}
      >
        <div className={`p-6 border-b border-umak-blue-50 ${isOpen ? '' : 'px-4'}`}>
          <Link
            href="/"
            className={`flex items-center gap-3 group ${isOpen ? '' : 'justify-center'}`}
            title="Back to landing page"
          >
            <div className={`relative flex-shrink-0 ${isOpen ? 'w-14 h-14' : 'w-12 h-12'}`}>
              <Image
                src="/images/cic_logo.png"
                alt="CIC Logo"
                fill
                className="object-contain"
              />
            </div>
            {isOpen && (
              <span className="font-marcellus text-2xl text-umak-yellow">User Portal</span>
            )}
          </Link>
        </div>

        <button
          onClick={onToggle}
          className="absolute -right-3 top-8 w-8 h-8 lg:w-6 lg:h-6 bg-umak-yellow rounded-full flex items-center justify-center hover:bg-yellow-500 transition-all shadow-md z-50"
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft size={20} className="text-umak-blue lg:w-4 lg:h-4" />
          ) : (
            <ChevronRight size={20} className="text-umak-blue lg:w-4 lg:h-4" />
          )}
        </button>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-metropolis text-sm font-medium group ${
                  isActive
                    ? 'bg-umak-yellow text-umak-blue font-bold shadow-sm'
                    : 'text-gray-200 hover:bg-umak-blue-50 hover:text-white'
                } ${!isOpen ? 'justify-center' : ''}`}
                title={!isOpen ? item.label : ''}
              >
                <Icon
                  size={20}
                  className={`flex-shrink-0 ${
                    isActive ? '' : 'group-hover:scale-110 transition-transform'
                  }`}
                />
                {isOpen && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

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
                  <p className="text-xs text-gray-300 font-metropolis truncate">
                    {user?.email}
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
                aria-label="Logout"
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
