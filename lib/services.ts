import {
  Trophy,
  Palette,
  Camera,
  Video,
  Megaphone,
  Globe,
  type LucideIcon,
} from 'lucide-react'

// Existing serviceType strings — these are wired into the form route
// (/usersubmitrequest/[type]) and startRequest listeners. Do NOT rename.
export type ServiceType =
  | 'design'
  | 'video'
  | 'coverage'
  | 'social-media'
  | 'branding'
  | 'website'

export interface Service {
  serviceType: ServiceType
  title: string
  description: string
  icon: LucideIcon
  tags: string[]
  status?: 'available' | 'coming-soon' | 'on-hold'
}

export const SERVICES: Service[] = [
  {
    serviceType: 'design',
    title: 'Corporate Requisites',
    description:
      'Managing requests for the design or approval of plaques, medals, trophies, and corporate giveaways for official recognition and events.',
    icon: Trophy,
    tags: ['Plaques', 'Medals & Trophies', 'Corporate Giveaways'],
    status: 'available',
  },
  {
    serviceType: 'branding',
    title: 'Design and Branding',
    description:
      'Guidance to ensure your creative materials align with University brand guidelines before production or release.',
    icon: Palette,
    tags: ['Brand Review', 'Guidelines Compliance', 'Material Approval'],
    status: 'available',
  },
  {
    serviceType: 'coverage',
    title: 'Event Coverage',
    description:
      'Photo documentation and basic coverage for university events and activities.',
    icon: Camera,
    tags: ['Photography', 'Event Documentation', 'Photo Editing'],
    status: 'available',
  },
  {
    serviceType: 'video',
    title: 'Footage',
    description:
      'Support for recording video messages and other university-related video content.',
    icon: Video,
    tags: ['Video Recording', 'Video Messages', 'Video Editing'],
    status: 'available',
  },
  {
    serviceType: 'social-media',
    title: 'Social Media',
    description:
      'Posting publicly available, university-wide announcements, congratulatory messages, and similar content on official platforms.',
    icon: Megaphone,
    tags: ['Announcements', 'Congratulatory Messages', 'Content Posting'],
    status: 'available',
  },
  {
    serviceType: 'website',
    title: 'Website Content Update',
    description:
      'Request new website entries or updates to existing pages for your office or unit.',
    icon: Globe,
    tags: ['New Entry', 'Page Updates', 'Content Management'],
    status: 'available',
  },
]

export function findService(serviceType: string): Service | undefined {
  return SERVICES.find((s) => s.serviceType === serviceType)
}
