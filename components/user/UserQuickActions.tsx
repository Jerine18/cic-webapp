'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { REQUEST_TYPES } from '@/lib/constants'

export default function UserQuickActions() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-umak-blue to-blue-900 p-6 sm:p-8 lg:p-10 shadow-lg">
      <div className="absolute top-0 right-0 w-72 h-72 bg-umak-yellow opacity-10 rounded-full blur-3xl transform translate-x-24 -translate-y-24 pointer-events-none" />

      {/* Heron Legacy Background Image */}
      <div className="absolute -right-[6.25rem] top-0 h-full w-3/5 pointer-events-none select-none">
        <Image
          src="/images/heronlegacy.png"
          alt=""
          fill
          className="object-cover opacity-60 object-[right_25%]"
          aria-hidden="true"
        />
      </div>

      <div className="relative">
        <h2 className="font-marcellus text-2xl sm:text-3xl text-white mb-2">
          Need our services?
        </h2>
        <p className="font-metropolis text-sm text-gray-200 mb-6 max-w-2xl">
          Submit a request and our team will get back to you shortly.
        </p>

        <button
          onClick={() => router.push('/usersubmitrequest')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-umak-yellow text-umak-blue rounded-lg font-metropolis font-bold text-sm uppercase tracking-wider shadow-md border-2 border-transparent transition-all duration-300 hover:bg-transparent hover:text-umak-yellow hover:border-umak-yellow hover:shadow-[0_0_20px_rgba(245,236,58,0.5)]"
        >
          <Plus size={18} />
          Submit New Request
        </button>

        <div className="mt-6">
          <p className="font-metropolis text-xs uppercase tracking-wider text-gray-300 mb-3">
            Or browse:
          </p>
          <div className="flex flex-wrap gap-2">
            {REQUEST_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => router.push(`/usersubmitrequest?type=${type.id}`)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full text-xs font-metropolis font-semibold transition-colors"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
