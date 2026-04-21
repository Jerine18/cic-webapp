import type { User } from '@supabase/supabase-js'

type ProfileLike = { full_name?: string | null } | null | undefined

export function getDisplayName(user: User | null, profile?: ProfileLike): string {
  // 1. Prefer Supabase profile.full_name if present
  if (profile?.full_name) return profile.full_name

  // 2. Prefer Google OAuth metadata
  const meta = user?.user_metadata as { full_name?: string; name?: string } | undefined
  if (meta?.full_name) return meta.full_name
  if (meta?.name) return meta.name

  // 3. Fallback: derive from email prefix (e.g. jdiaz.a12240995 -> "J. Diaz")
  const email = user?.email ?? ''
  const prefix = email.split('@')[0] ?? ''
  const firstDotSegment = prefix.split('.')[0] ?? prefix
  if (!firstDotSegment) return 'User'

  if (firstDotSegment.length > 1) {
    const initial = firstDotSegment[0].toUpperCase()
    const surname =
      firstDotSegment.slice(1).charAt(0).toUpperCase() + firstDotSegment.slice(2)
    return `${initial}. ${surname}`
  }
  return firstDotSegment.toUpperCase()
}

export function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s.replace('.', '')[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}
