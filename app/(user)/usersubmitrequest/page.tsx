'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { REQUEST_TYPES } from '@/lib/constants'
import UserPageHeader from '@/components/user/UserPageHeader'
import UserServiceTypeCard from '@/components/user/UserServiceTypeCard'

export default function UserSubmitRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)

  const handleSelect = (typeId: string) => {
    sessionStorage.setItem('pendingServiceType', typeId)
    router.push('/')
  }

  useEffect(() => {
    if (handledRef.current) return
    const type = searchParams.get('type')
    if (type && REQUEST_TYPES.find((t) => t.id === type)) {
      handledRef.current = true
      handleSelect(type)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <UserPageHeader
        title="Submit a New Request"
        subtitle="Choose the type of service you need from the options below."
      />
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="mb-6 bg-blue-50 border-l-4 border-umak-blue rounded-r-lg p-4">
          <p className="text-sm font-metropolis text-umak-blue">
            <strong>Step 1 of 2:</strong> Select the service type you need. You&apos;ll fill in the
            details on the next screen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REQUEST_TYPES.map((type) => (
            <UserServiceTypeCard key={type.id} type={type} onSelect={handleSelect} />
          ))}
        </div>
      </div>
    </div>
  )
}
