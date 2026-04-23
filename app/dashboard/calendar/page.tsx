'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

type ViewType = 'month' | 'week' | 'day'

interface CICAvailability {
  date: string
  status: 'available' | 'busy' | 'limited' | 'unavailable'
  events: number
}

interface UpcomingRequest {
  id: number
  name: string
  deadline: string
  priority: 'High' | 'Medium' | 'Low'
  requestor: string
}

interface ScheduleEvent {
  id: number
  time: string
  title: string
  description: string
  status: 'inprogress' | 'upcoming'
}

interface TeamAvailability {
  team: string
  status: 'available' | 'busy' | 'limited'
  detail: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [view, setView] = useState<ViewType>('month')

  const cicAvailability: CICAvailability[] = [
    { date: '2026-01-28', status: 'available', events: 2 },
    { date: '2026-01-29', status: 'busy', events: 4 },
    { date: '2026-01-30', status: 'limited', events: 3 },
    { date: '2026-01-31', status: 'available', events: 1 },
    { date: '2026-02-01', status: 'unavailable', events: 5 },
    { date: '2026-02-03', status: 'available', events: 0 },
  ]

  const upcomingRequests: UpcomingRequest[] = [
    { id: 1, name: 'Event Coverage - College Day', deadline: '2026-02-05', priority: 'High', requestor: 'Student Affairs' },
    { id: 2, name: 'Social Media Graphics', deadline: '2026-02-03', priority: 'Medium', requestor: 'Marketing' },
    { id: 3, name: 'Website Banner Update', deadline: '2026-02-07', priority: 'Low', requestor: 'IT Department' },
    { id: 4, name: 'Video Production', deadline: '2026-02-10', priority: 'High', requestor: 'Registrar' },
  ]

  const scheduleEvents: ScheduleEvent[] = [
    { id: 1, time: '9:00 AM', title: 'Team Meeting', description: 'Weekly status update and planning', status: 'inprogress' },
    { id: 2, time: '11:00 AM', title: 'Event Coverage', description: 'Department Meeting', status: 'upcoming' },
    { id: 3, time: '2:00 PM', title: 'Design Review', description: 'Graphic design approvals', status: 'upcoming' },
  ]

  const teamAvailability: TeamAvailability[] = [
    { team: 'Design Team', status: 'available', detail: '3 members available' },
    { team: 'Video Team', status: 'busy', detail: '2 events scheduled' },
    { team: 'Social Media Team', status: 'limited', detail: '1 member available' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="CIC Calendar"
        subtitle="Track availability, deadlines, and team schedules"
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <ViewControls view={view} setView={setView} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CalendarView 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            cicAvailability={cicAvailability} 
          />
          <UpcomingDeadlines requests={upcomingRequests} />
        </div>

        <TodaysSchedule events={scheduleEvents} />
        <TeamAvailabilitySection teams={teamAvailability} />
      </div>
    </div>
  )
}

function ViewControls({ view, setView, selectedDate, setSelectedDate }: {
  view: ViewType
  setView: (view: ViewType) => void
  selectedDate: string
  setSelectedDate: (date: string) => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          {(['month', 'week', 'day'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg font-bold font-metropolis transition-all capitalize text-sm ${
                view === v ? 'bg-umak-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-lg font-metropolis focus:outline-none focus:ring-2 focus:ring-umak-blue text-sm"
          />
          <button 
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="bg-umak-yellow text-umak-blue px-6 py-2 rounded-lg hover:bg-yellow-500 transition-all font-bold font-metropolis text-sm"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  )
}

function CalendarView({ selectedDate, setSelectedDate, cicAvailability }: {
  selectedDate: string
  setSelectedDate: (date: string) => void
  cicAvailability: CICAvailability[]
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-marcellus text-umak-blue mb-6">January 2026</h2>
      
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold text-sm text-gray-700 font-metropolis py-2">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 35 }, (_, i) => {
          const dayNum = i - 2
          const isCurrentMonth = dayNum > 0 && dayNum <= 31
          const dateStr = isCurrentMonth ? `2026-01-${String(dayNum).padStart(2, '0')}` : ''
          const availability = cicAvailability.find(a => a.date === dateStr)
          
          const statusColors = {
            available: 'border-green-300 hover:border-green-500',
            busy: 'border-orange-300 hover:border-orange-500',
            limited: 'border-yellow-300 hover:border-yellow-500',
            unavailable: 'border-red-300 hover:border-red-500',
          }
          
          return (
            <div
              key={i}
              className={`aspect-square border-2 rounded-lg p-2 text-center transition-all cursor-pointer ${
                !isCurrentMonth
                  ? 'bg-gray-50 border-gray-200 text-gray-400'
                  : dateStr === selectedDate
                  ? 'border-umak-yellow bg-umak-yellow bg-opacity-20'
                  : availability
                  ? statusColors[availability.status]
                  : 'border-gray-300 hover:border-umak-blue'
              }`}
              onClick={() => isCurrentMonth && setSelectedDate(dateStr)}
            >
              <div className="text-sm font-bold font-metropolis">
                {isCurrentMonth ? dayNum : ''}
              </div>
              {availability && (
                <div className="text-xs text-gray-600 font-metropolis mt-1">
                  {availability.events}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <CalendarLegend />
    </div>
  )
}

function CalendarLegend() {
  const statuses = [
    { label: 'Available', color: 'border-green-500 bg-green-100' },
    { label: 'Limited', color: 'border-yellow-500 bg-yellow-100' },
    { label: 'Busy', color: 'border-orange-500 bg-orange-100' },
    { label: 'Unavailable', color: 'border-red-500 bg-red-100' },
  ]

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-sm font-bold text-gray-700 font-metropolis mb-3">Status Legend</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded border-2 ${status.color}`}></div>
            <span className="text-xs font-metropolis">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function UpcomingDeadlines({ requests }: { requests: UpcomingRequest[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-umak-blue font-metropolis mb-4">Upcoming Deadlines</h3>
      <div className="space-y-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
      <button className="w-full mt-4 px-4 py-2.5 text-sm font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
        View All Deadlines
      </button>
    </div>
  )
}

function RequestCard({ request }: { request: UpcomingRequest }) {
  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  }

  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-umak-blue hover:shadow-sm transition-all">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold text-gray-900 font-metropolis flex-1">{request.name}</h4>
        <span className={`px-2 py-1 rounded text-xs font-bold font-metropolis uppercase ${priorityColors[request.priority]}`}>
          {request.priority}
        </span>
      </div>
      <p className="text-xs text-gray-600 font-metropolis mb-2">{request.requestor}</p>
      <p className="text-xs text-gray-700 font-metropolis font-bold">
        Due: {new Date(request.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>
    </div>
  )
}

function TodaysSchedule({ events }: { events: ScheduleEvent[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-2xl font-marcellus text-umak-blue mb-4">Today's Schedule - January 28, 2026</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <ScheduleEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}

function ScheduleEventCard({ event }: { event: ScheduleEvent }) {
  const statusConfig = {
    inprogress: { bg: 'bg-blue-50', border: 'border-umak-blue', badge: 'bg-umak-blue text-white', label: 'IN PROGRESS' },
    upcoming: { bg: 'bg-gray-50', border: 'border-gray-400', badge: 'bg-gray-200 text-gray-700', label: 'UPCOMING' },
  }

  const config = statusConfig[event.status]

  return (
    <div className={`flex items-start gap-4 p-4 ${config.bg} rounded-lg border-l-4 ${config.border}`}>
      <div className="text-sm font-bold text-gray-700 font-metropolis w-20">{event.time}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900 font-metropolis">{event.title}</h4>
        <p className="text-xs text-gray-600 font-metropolis mt-1">{event.description}</p>
      </div>
      <span className={`px-3 py-1 ${config.badge} rounded text-xs font-bold font-metropolis`}>{config.label}</span>
    </div>
  )
}

function TeamAvailabilitySection({ teams }: { teams: TeamAvailability[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-umak-blue font-metropolis">Team Availability Today</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard key={team.team} team={team} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamCard({ team }: { team: TeamAvailability }) {
  const statusConfig = {
    available: { border: 'border-green-300', bg: 'bg-green-50', badge: 'bg-green-600 text-white', label: 'AVAILABLE' },
    busy: { border: 'border-orange-300', bg: 'bg-orange-50', badge: 'bg-orange-600 text-white', label: 'BUSY' },
    limited: { border: 'border-yellow-300', bg: 'bg-yellow-50', badge: 'bg-yellow-600 text-white', label: 'LIMITED' },
  }

  const config = statusConfig[team.status]

  return (
    <div className={`p-4 border-2 ${config.border} rounded-lg ${config.bg}`}>
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-bold text-gray-900 font-metropolis">{team.team}</h4>
        <span className={`px-3 py-1 ${config.badge} rounded text-xs font-bold font-metropolis`}>{config.label}</span>
      </div>
      <p className="text-xs text-gray-600 font-metropolis mt-2">{team.detail}</p>
    </div>
  )
}
