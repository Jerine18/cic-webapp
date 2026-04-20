'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import UserSidebar from '@/components/user/UserSidebar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main
          className="flex-1 transition-all duration-300 min-h-screen w-full"
          style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}
