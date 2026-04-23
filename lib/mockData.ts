export interface Submission {
  id: string
  name: string
  email: string
  phone?: string
  details: string
  type: 'design' | 'video' | 'coverage' | 'social-media' | 'branding' | 'website'
  priority: 'Low' | 'Medium' | 'High'
  status: 'Pending' | 'In Progress' | 'Completed'
  assignee?: string
  deadline?: string | null
  department?: string | null
  createdAt: Date
  updatedAt: Date
}

export const mockSubmissions: Submission[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria.santos@umak.edu.ph',
    phone: '+63 912 345 6789',
    details: 'Request for official logo files for department materials',
    type: 'design',
    priority: 'High',
    status: 'In Progress',
    assignee: 'Ken Garcia',
    createdAt: new Date('2026-01-27T09:30:00'),
    updatedAt: new Date('2026-01-27T10:15:00'),
  },
  {
    id: '2',
    name: 'John Dela Cruz',
    email: 'john.delacruz@umak.edu.ph',
    phone: '+63 923 456 7890',
    details: 'Need approval for social media campaign about upcoming enrollment',
    type: 'social-media',
    priority: 'High',
    status: 'Pending',
    createdAt: new Date('2026-01-27T08:15:00'),
    updatedAt: new Date('2026-01-27T08:15:00'),
  },
  {
    id: '3',
    name: 'Sarah Reyes',
    email: 'sarah.reyes@umak.edu.ph',
    details: 'Request for branded templates for department presentations',
    type: 'branding',
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date('2026-01-26T14:20:00'),
    updatedAt: new Date('2026-01-26T14:20:00'),
  },
  {
    id: '4',
    name: 'Robert Tan',
    email: 'robert.tan@umak.edu.ph',
    phone: '+63 945 678 9012',
    details: 'Website content update for College of Engineering page',
    type: 'website',
    priority: 'Low',
    status: 'Completed',
    assignee: 'Admin Team',
    createdAt: new Date('2026-01-25T11:00:00'),
    updatedAt: new Date('2026-01-26T16:30:00'),
  },
  {
    id: '5',
    name: 'Anna Cruz',
    email: 'anna.cruz@umak.edu.ph',
    details: 'Press release for research symposium event',
    type: 'coverage',
    priority: 'High',
    status: 'In Progress',
    assignee: 'Ken Garcia',
    createdAt: new Date('2026-01-26T10:45:00'),
    updatedAt: new Date('2026-01-27T09:00:00'),
  },
  {
    id: '6',
    name: 'Michael Lopez',
    email: 'michael.lopez@umak.edu.ph',
    phone: '+63 956 789 0123',
    details: 'Video production request for graduation ceremony highlights',
    type: 'video',
    priority: 'Medium',
    status: 'Pending',
    createdAt: new Date('2026-01-27T07:30:00'),
    updatedAt: new Date('2026-01-27T07:30:00'),
  },
]
