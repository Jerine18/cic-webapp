'use client'

import { ChevronRight } from 'lucide-react'
import { RequestType } from '@/lib/types'

interface UserServiceTypeCardProps {
  type: RequestType
  onSelect: (id: string) => void
}

export default function UserServiceTypeCard({ type, onSelect }: UserServiceTypeCardProps) {
  const truncated =
    type.description.length > 100 ? `${type.description.slice(0, 100).trim()}...` : type.description

  return (
    <button
      type="button"
      onClick={() => onSelect(type.id)}
      className="group relative text-left bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-umak-yellow hover:shadow-xl hover:-translate-y-1 transition-all duration-200 w-full h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="font-marcellus text-5xl text-gray-200 group-hover:text-umak-yellow transition-colors">
          {type.number}
        </span>
      </div>

      <h3 className="font-marcellus text-xl text-umak-blue mb-2">{type.label}</h3>
      <p className="font-metropolis text-sm text-gray-600 mb-4 flex-1">{truncated}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {type.subtypes.slice(0, 3).map((sub) => (
          <span
            key={sub}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-metropolis rounded-md"
          >
            {sub}
          </span>
        ))}
        {type.subtypes.length > 3 && (
          <span className="px-2 py-1 text-gray-500 text-xs font-metropolis">
            +{type.subtypes.length - 3} more
          </span>
        )}
      </div>

      <div className="absolute bottom-4 right-4 text-gray-300 group-hover:text-umak-yellow transition-colors">
        <ChevronRight size={24} />
      </div>
    </button>
  )
}
