'use client'

import { Service } from '@/lib/services'

interface UserServiceTypeCardProps {
  service: Service
  onSelect: (serviceType: string) => void
}

export default function UserServiceTypeCard({ service, onSelect }: UserServiceTypeCardProps) {
  const Icon = service.icon

  return (
    <button
      type="button"
      onClick={() => onSelect(service.serviceType)}
      aria-label={`Select ${service.title}`}
      className={[
        'group text-left w-full h-full flex flex-col gap-4',
        'bg-white rounded-xl border border-[#001A41]/10 p-6',
        'outline outline-2 outline-transparent -outline-offset-2',
        'transition-all duration-200 ease-out',
        // Navy inversion + gold outline + lift + glow on hover / focus / active
        'hover:bg-[#001A41] hover:outline-[#FFD700] hover:-translate-y-0.5',
        'hover:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
        'focus-visible:bg-[#001A41] focus-visible:outline-[#FFD700] focus-visible:-translate-y-0.5',
        'focus-visible:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
        'active:bg-[#001A41] active:outline-[#FFD700] active:-translate-y-0.5',
        'active:shadow-[0_0_0_4px_rgba(255,215,0,0.25),0_10px_30px_rgba(0,26,65,0.25)]',
      ].join(' ')}
    >
      {/* Icon tile */}
      <div
        aria-hidden="true"
        className={[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          'bg-[#001A41]/[0.08]',
          'group-hover:bg-white/10 group-focus-visible:bg-white/10 group-active:bg-white/10',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        <Icon
          size={20}
          className={[
            'text-[#001A41]',
            'group-hover:text-white group-focus-visible:text-white group-active:text-white',
            'transition-colors duration-200 ease-out',
          ].join(' ')}
        />
      </div>

      {/* Title */}
      <h3
        className={[
          'font-marcellus text-[18px] leading-snug',
          'text-[#001A41]',
          'group-hover:text-white group-focus-visible:text-white group-active:text-white',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        {service.title}
      </h3>

      {/* Description */}
      <p
        className={[
          'font-metropolis text-sm leading-relaxed flex-1',
          'text-[#001A41]/60',
          'group-hover:text-white/75 group-focus-visible:text-white/75 group-active:text-white/75',
          'transition-colors duration-200 ease-out',
        ].join(' ')}
      >
        {service.description}
      </p>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2 pt-1">
        {service.tags.map((tag) => (
          <span
            key={tag}
            className={[
              'px-2.5 py-1 text-xs font-metropolis rounded-full',
              'bg-gray-100 text-gray-700 border border-transparent',
              'group-hover:bg-transparent group-hover:border-white/25 group-hover:text-white/90',
              'group-focus-visible:bg-transparent group-focus-visible:border-white/25 group-focus-visible:text-white/90',
              'group-active:bg-transparent group-active:border-white/25 group-active:text-white/90',
              'transition-colors duration-200 ease-out',
            ].join(' ')}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
