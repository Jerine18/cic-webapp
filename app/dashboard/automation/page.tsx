//automation page

'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

type TabType = 'routing' | 'notifications' | 'reminders' | 'reports'

interface RoutingRule {
  id: number
  requestType: string
  assignTo: string
  status: string
  requests: number
}

interface NotificationTemplate {
  id: number
  name: string
  trigger: string
  sent: number
  status: string
}

interface Reminder {
  id: number
  name: string
  type: string
  frequency: string
  active: boolean
  sent: number
}

interface Report {
  id: number
  week: string
  requests: number
  completed: number
  pending: number
  generated: boolean
  date: string
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<TabType>('routing')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Automation Workflows"
        subtitle="Manage routing, notifications, reminders, and reports"
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="animate-fadeIn">
          {activeTab === 'routing' && <AutoRoutingSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'reminders' && <RemindersSection />}
          {activeTab === 'reports' && <WeeklyReportsSection />}
        </div>
      </div>
    </div>
  )
}

function TabNavigation({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const tabs = [
    { id: 'routing' as TabType, label: 'Auto-Routing' },
    { id: 'notifications' as TabType, label: 'Email Notifications' },
    { id: 'reminders' as TabType, label: 'Deadline Reminders' },
    { id: 'reports' as TabType, label: 'Weekly Reports' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 text-sm font-bold font-metropolis uppercase tracking-wide transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-umak-blue text-white border-b-4 border-umak-yellow'
                : 'bg-white text-gray-600 hover:bg-gray-50 border-b-4 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function AutoRoutingSection() {
  const routingRules: RoutingRule[] = [
    { id: 1, requestType: 'Graphic Design', assignTo: 'Design Team', status: 'Active', requests: 45 },
    { id: 2, requestType: 'Video Production', assignTo: 'Video Team', status: 'Active', requests: 28 },
    { id: 3, requestType: 'Event Coverage', assignTo: 'Photo/Video Team', status: 'Active', requests: 62 },
    { id: 4, requestType: 'Website Update', assignTo: 'Web Team', status: 'Active', requests: 15 },
    { id: 5, requestType: 'Social Media', assignTo: 'Social Media Team', status: 'Active', requests: 89 },
    { id: 6, requestType: 'Corporate Requisites', assignTo: 'Admin Team', status: 'Active', requests: 34 },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Auto-Route Configuration"
        description="Automatically assign requests to team members based on request type"
        actionLabel="Add Rule"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-umak-blue to-umak-blue-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Request Type</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white hidden md:table-cell">Auto-Assign To</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white hidden lg:table-cell">Total Routed</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold font-metropolis uppercase tracking-wider text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {routingRules.map((rule) => (
                <tr key={rule.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="text-sm font-bold text-gray-900 font-metropolis">{rule.requestType}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-700 font-metropolis">{rule.assignTo}</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                    <div className="text-sm text-gray-700 font-metropolis">{rule.requests} requests</div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <StatusBadge status={rule.status} type="success" />
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <ActionButtons />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function NotificationsSection() {
  const notificationTemplates: NotificationTemplate[] = [
    { id: 1, name: 'Request Received', trigger: 'On Submission', sent: 156, status: 'Active' },
    { id: 2, name: 'Request Approved', trigger: 'Status Change', sent: 89, status: 'Active' },
    { id: 3, name: 'Request In Progress', trigger: 'Status Change', sent: 67, status: 'Active' },
    { id: 4, name: 'Request Completed', trigger: 'Status Change', sent: 45, status: 'Active' },
    { id: 5, name: 'Request Rejected', trigger: 'Status Change', sent: 12, status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Email Notification Templates"
        description="Automated email notifications sent to requestors"
        actionLabel="New Template"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notificationTemplates.map((template) => (
          <NotificationCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}

function NotificationCard({ template }: { template: NotificationTemplate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-umak-blue group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-umak-blue font-metropolis group-hover:text-umak-blue-50 transition-colors">
            {template.name}
          </h3>
          <p className="text-sm text-gray-600 font-metropolis mt-1">Trigger: {template.trigger}</p>
        </div>
        <StatusBadge status={template.status} type="success" />
      </div>
      <div className="border-t border-gray-100 pt-4 mt-4">
        <p className="text-sm text-gray-700 font-metropolis mb-4">
          <span className="font-bold text-umak-blue">{template.sent}</span> emails sent
        </p>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 text-xs font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
            EDIT
          </button>
          <button className="flex-1 px-4 py-2.5 text-xs font-bold text-gray-600 border-2 border-gray-300 hover:bg-gray-600 hover:text-white rounded-lg transition-all font-metropolis">
            PREVIEW
          </button>
        </div>
      </div>
    </div>
  )
}

function RemindersSection() {
  const reminders: Reminder[] = [
    { id: 1, name: '3 Days Before Deadline', type: 'Deadline Warning', frequency: 'Once', active: true, sent: 45 },
    { id: 2, name: '1 Day Before Deadline', type: 'Deadline Warning', frequency: 'Once', active: true, sent: 38 },
    { id: 3, name: 'Deadline Passed', type: 'Overdue Alert', frequency: 'Daily', active: true, sent: 12 },
    { id: 4, name: 'Weekly Status Update', type: 'Status Reminder', frequency: 'Weekly', active: true, sent: 156 },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Deadline Reminder Configuration"
        description="Automatic reminders for upcoming and overdue deadlines"
        actionLabel="Add Reminder"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-umak-blue to-umak-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Reminder Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Frequency</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Sent</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold font-metropolis uppercase tracking-wider text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reminders.map((reminder) => (
                <tr key={reminder.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 font-metropolis">{reminder.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{reminder.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{reminder.frequency}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{reminder.sent} reminders</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={reminder.active ? 'Active' : 'Inactive'} type={reminder.active ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-6 py-4">
                    <ActionButtons />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function WeeklyReportsSection() {
  const reports: Report[] = [
    { id: 1, week: 'Jan 20-26, 2026', requests: 45, completed: 38, pending: 7, generated: true, date: '2026-01-26' },
    { id: 2, week: 'Jan 13-19, 2026', requests: 52, completed: 48, pending: 4, generated: true, date: '2026-01-19' },
    { id: 3, week: 'Jan 6-12, 2026', requests: 38, completed: 35, pending: 3, generated: true, date: '2026-01-12' },
    { id: 4, week: 'Dec 30-Jan 5, 2026', requests: 28, completed: 28, pending: 0, generated: true, date: '2026-01-05' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Weekly Activity Reports"
        description="Automated weekly report generation and submission tracking"
        actionLabel="Generate Current Week"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="This Week" value="45" subtitle="Total Requests" color="blue" />
        <StatCard label="Completed" value="38" subtitle="84% completion" color="green" />
        <StatCard label="In Progress" value="7" subtitle="16% pending" color="orange" />
        <StatCard label="Avg Time" value="2.3" subtitle="days to complete" color="gray" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-umak-blue font-metropolis">Previous AR Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-umak-blue to-umak-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Week Period</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Total Requests</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Completed</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Pending</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Generated</th>
                <th className="px-6 py-4 text-center text-xs font-bold font-metropolis uppercase tracking-wider text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 font-metropolis">{report.week}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{report.requests}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-green-600 font-bold font-metropolis">{report.completed}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-orange-600 font-bold font-metropolis">{report.pending}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status="Generated" type="success" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="px-4 py-2 text-xs font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
                        VIEW
                      </button>
                      <button className="px-4 py-2 text-xs font-bold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all font-metropolis">
                        DOWNLOAD
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title, description, actionLabel }: { title: string; description: string; actionLabel: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-marcellus text-umak-blue">{title}</h2>
          <p className="text-sm text-gray-600 font-metropolis mt-1">{description}</p>
        </div>
        <button className="bg-umak-yellow text-umak-blue px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all font-bold font-metropolis shadow-sm hover:shadow-md whitespace-nowrap">
          {actionLabel}
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status, type }: { status: string; type: 'success' | 'neutral' | 'warning' }) {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
  }

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold font-metropolis uppercase tracking-wide border ${colors[type]}`}>
      {status}
    </span>
  )
}

function ActionButtons() {
  return (
    <div className="flex gap-1 sm:gap-2 justify-center">
      <button className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis whitespace-nowrap">
        EDIT
      </button>
      <button className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all font-metropolis whitespace-nowrap">
        DISABLE
      </button>
    </div>
  )
}

function StatCard({ label, value, subtitle, color }: { label: string; value: string; subtitle: string; color: 'blue' | 'green' | 'orange' | 'gray' }) {
  const colors = {
    blue: 'border-umak-blue',
    green: 'border-green-600',
    orange: 'border-orange-500',
    gray: 'border-gray-400',
  }

  const textColors = {
    blue: 'text-umak-blue',
    green: 'text-green-600',
    orange: 'text-orange-500',
    gray: 'text-gray-900',
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${colors[color]} p-6 hover:shadow-md transition-shadow`}>
      <p className="text-sm font-semibold text-gray-600 font-metropolis uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-4xl font-bold font-marcellus ${textColors[color]} mb-1`}>{value}</p>
      <p className="text-xs text-gray-500 font-metropolis">{subtitle}</p>
    </div>
  )
}
