'use client'

import { useEffect } from 'react'

interface BeforeProceedModalProps {
  serviceType: string | null
  onProceed: () => void
  onCancel: () => void
}

interface ServiceNotes {
  title: string
  subtitle?: string
  bullets: string[]
}

// Event Coverage / Footage share the conflict bullet; EC additionally gets the
// all-in-one and livestreaming notes.
const NOTE_ALL_IN_ONE =
  "Select Event Coverage for all-in-one support. This single request handles everything from start to finish, including poster design, so you don't have to fill out multiple forms."
const NOTE_CONFLICT =
  'Please note that due to limited resources, you cannot book Event Coverage and Footage Requests at the same time.'
const NOTE_LIVESTREAM =
  'Livestreaming requests are temporarily on hold while we update our guidelines. Please contact our office for more information.'

// Social Media-specific notes.
const NOTE_BRAND_BOOK =
  'All social media posts must adhere to the UMak Brand Book (bit.ly/UMakBrandKit) to maintain brand consistency.'
const NOTE_PUBLIC_ANNOUNCEMENTS =
  'Event and activity announcements intended for the general public, all UMak students, or the Makati community are welcome for posting on the official UMak Facebook Page.'
const NOTE_INTERNAL_ANNOUNCEMENTS =
  "Announcements for events or activities that are exclusive to specific internal groups should be posted through the CCO's respective social media pages."

const SERVICE_NOTES: Record<string, ServiceNotes> = {
  coverage: {
    title: 'NOTE:',
    bullets: [NOTE_ALL_IN_ONE, NOTE_CONFLICT, NOTE_LIVESTREAM],
  },
  video: {
    title: 'NOTE:',
    bullets: [NOTE_CONFLICT],
  },
  'social-media': {
    title: 'NOTE:',
    bullets: [
      NOTE_BRAND_BOOK,
      NOTE_PUBLIC_ANNOUNCEMENTS,
      NOTE_INTERNAL_ANNOUNCEMENTS,
    ],
  },
}

// Which service types should open this modal before routing to the form.
export const BEFORE_PROCEED_SERVICE_TYPES = new Set(Object.keys(SERVICE_NOTES))

export default function BeforeProceedModal({
  serviceType,
  onProceed,
  onCancel,
}: BeforeProceedModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!serviceType) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [serviceType, onCancel])

  if (!serviceType) return null

  const notes = SERVICE_NOTES[serviceType]
  if (!notes) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="before-proceed-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-xl border-2 border-[#FFD700] bg-[#001A41] p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="before-proceed-title"
          className="font-marcellus text-[22px] text-[#FFD700]"
        >
          {notes.title}
        </h2>

        {notes.subtitle && (
          <p className="mt-2 font-metropolis text-sm text-white/80">{notes.subtitle}</p>
        )}

        <ul className="mt-5 mb-8 space-y-4">
          {notes.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex gap-3 font-metropolis text-sm leading-relaxed text-white"
            >
              <span aria-hidden="true" className="mt-1 text-[#FFD700]">
                •
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-white bg-transparent px-5 py-2 font-metropolis text-sm text-white transition-colors hover:text-[#FFD700]"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={onProceed}
            className={[
              'rounded-lg border-2 border-[#FFD700] bg-[#FFD700] px-5 py-2',
              'font-metropolis text-sm font-bold text-[#001A41]',
              'transition-colors duration-150',
              'hover:bg-transparent hover:text-[#FFD700]',
              'active:bg-transparent active:text-[#FFD700]',
            ].join(' ')}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
