import { RequestType, FormData } from './types'
import { SERVICES } from './services'

// =============================================================================
// CONSTANTS
// =============================================================================

// Derived from the canonical SERVICES list in lib/services.ts.
// Kept around as a compatibility shape for consumers that expect the older
// RequestType fields (id, label, subtypes, number, bgColor).
export const REQUEST_TYPES: RequestType[] = SERVICES.map((s, i) => ({
  id: s.serviceType,
  label: s.title,
  description: s.description,
  number: String(i + 1).padStart(2, '0'),
  subtypes: s.tags,
  bgColor: i % 2 === 0 ? 'bg-blue-50' : 'bg-white',
}))

export const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  department: '',
  requestDetails: '',
  deadline: '',
  priority: 'Medium',
}
