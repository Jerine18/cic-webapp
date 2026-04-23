'use client'

import { useState, useRef } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import CertificateCanvas from '@/components/certificate/CertificateCanvas'
import BatchGenerator from '@/components/certificate/BatchGenerator'
import TextControls from '@/components/certificate/TextControls'
import { Plus, Upload, Download } from 'lucide-react'
import { CertificateTemplate, TextElement, ImageElement } from '@/types/certificates'

type TabType = 'letterhead' | 'certificate' | 'formbuilder'

interface Template {
  id: number
  name: string
  category: string
  uses: number
  lastModified: string
}

interface CertificateType {
  id: number
  name: string
  uses: number
  status: string
}

interface Form {
  id: number
  name: string
  fields: number
  submissions: number
  status: string
  created: string
}

export default function UtilityToolsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('letterhead')

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Utility Tools Suite"
        subtitle="Letterhead generator, certificate maker, and form builder"
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="animate-fadeIn">
          {activeTab === 'letterhead' && <LetterheadSection />}
          {activeTab === 'certificate' && <CertificateSection />}
          {activeTab === 'formbuilder' && <FormBuilderSection />}
        </div>
      </div>
    </div>
  )
}

function TabNavigation({ activeTab, onTabChange }: { activeTab: TabType; onTabChange: (tab: TabType) => void }) {
  const tabs = [
    { id: 'letterhead' as TabType, label: 'Letterhead Generator' },
    { id: 'certificate' as TabType, label: 'Certificate Generator' },
    { id: 'formbuilder' as TabType, label: 'Form Builder' },
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

function LetterheadSection() {
  const templates: Template[] = [
    { id: 1, name: 'Official Letterhead', category: 'Standard', uses: 234, lastModified: '2026-01-15' },
    { id: 2, name: 'CIC Department', category: 'Department', uses: 156, lastModified: '2026-01-10' },
    { id: 3, name: 'Event Invitation', category: 'Events', uses: 89, lastModified: '2026-01-05' },
    { id: 4, name: 'Memorandum', category: 'Internal', uses: 67, lastModified: '2025-12-28' },
  ]

  const [formData, setFormData] = useState({
    template: '',
    recipient: '',
    subject: '',
    body: '',
    sender: '',
    position: '',
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-marcellus text-umak-blue mb-6">Generate Letterhead</h2>
          
          <div className="space-y-4">
            <FormField
              label="Template"
              value={formData.template}
              onChange={(value) => setFormData({ ...formData, template: value })}
              type="select"
              options={['Official Letterhead', 'CIC Department', 'Event Invitation', 'Memorandum']}
            />

            <FormField
              label="Recipient Name"
              value={formData.recipient}
              onChange={(value) => setFormData({ ...formData, recipient: value })}
              placeholder="e.g., Dr. Juan Dela Cruz"
            />

            <FormField
              label="Subject"
              value={formData.subject}
              onChange={(value) => setFormData({ ...formData, subject: value })}
              placeholder="Letter subject"
            />

            <FormField
              label="Body Content"
              value={formData.body}
              onChange={(value) => setFormData({ ...formData, body: value })}
              type="textarea"
              rows={8}
              placeholder="Enter letter content..."
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Sender Name"
                value={formData.sender}
                onChange={(value) => setFormData({ ...formData, sender: value })}
                placeholder="Your name"
              />
              <FormField
                label="Position/Title"
                value={formData.position}
                onChange={(value) => setFormData({ ...formData, position: value })}
                placeholder="Your position"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-umak-blue text-white px-6 py-3 rounded-lg hover:bg-umak-blue-50 transition-all font-bold font-metropolis shadow-sm">
                Preview
              </button>
              <button className="flex-1 bg-umak-yellow text-umak-blue px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all font-bold font-metropolis shadow-sm">
                Generate & Download
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-umak-blue font-metropolis mb-4">Available Templates</h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
          <button className="w-full mt-4 px-4 py-2.5 text-sm font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
            Create New Template
          </button>
        </div>
      </div>

      <RecentDocuments type="Letterheads" />
    </div>
  )
}

function CertificateSection() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single')
  const [template, setTemplate] = useState<CertificateTemplate | null>(null)
  const [textElements, setTextElements] = useState<TextElement[]>([
    {
      id: 'text-1',
      text: '{{name}}',
      position: { x: 600, y: 400 },
      fontSize: 48,
      fontFamily: 'Georgia',
      color: '#000000',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      maxWidth: 800
    }
  ])
  const [imageElements, setImageElements] = useState<ImageElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [selectedElementType, setSelectedElementType] = useState<'text' | 'image' | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const templateUploadRef = useRef<HTMLInputElement>(null)

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        setTemplate({
          id: `template-${Date.now()}`,
          name: file.name,
          backgroundImage: event.target?.result as string,
          width: img.width,
          height: img.height
        })
        // Update text element positions based on new dimensions
        setTextElements(prev => prev.map(el => ({
          ...el,
          position: { x: img.width / 2, y: el.position.y * (img.height / 850) }
        })))
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  const downloadCertificate = () => {
    if (!canvasRef.current) return
    
    const link = document.createElement('a')
    link.download = `certificate_${Date.now()}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  const addTextElement = () => {
    const newElement: TextElement = {
      id: `text-${Date.now()}`,
      text: '{{name}}',
      position: { x: template ? template.width / 2 : 600, y: template ? template.height / 2 : 450 },
      fontSize: 36,
      fontFamily: 'Georgia',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      maxWidth: 800
    }
    setTextElements([...textElements, newElement])
    setSelectedElement(newElement.id)
    setSelectedElementType('text')
  }

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(
      textElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    )
  }

  const updateImageElement = (id: string, updates: Partial<ImageElement>) => {
    setImageElements(
      imageElements.map((el) => (el.id === id ? { ...el, ...updates } : el))
    )
  }

  const selectedTextElement = textElements.find(el => el.id === selectedElement)

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('single')}
          className={`px-6 py-2.5 rounded-lg font-bold font-metropolis text-sm transition-all ${
            mode === 'single'
              ? 'bg-umak-blue text-white shadow-sm'
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-umak-blue'
          }`}
        >
          Single Certificate
        </button>
        <button
          onClick={() => setMode('bulk')}
          className={`px-6 py-2.5 rounded-lg font-bold font-metropolis text-sm transition-all ${
            mode === 'bulk'
              ? 'bg-umak-blue text-white shadow-sm'
              : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-umak-blue'
          }`}
        >
          Bulk Generator
        </button>
      </div>

      {mode === 'single' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-marcellus text-umak-blue">Certificate Designer</h2>
              {template && (
                <button
                  onClick={downloadCertificate}
                  className="px-4 py-2 bg-umak-blue text-white rounded-lg hover:bg-blue-700 transition-all font-bold font-metropolis text-sm shadow-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {!template ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                <input
                  ref={templateUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handleTemplateUpload}
                  className="hidden"
                />
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold font-metropolis text-gray-700 mb-2">
                  Upload Certificate Template
                </h3>
                <p className="text-sm text-gray-500 mb-4 font-metropolis">
                  Upload your certificate background from Canva or any design tool
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Supports PNG, JPG, JPEG • Recommended: 1200x850px
                </p>
                <button
                  onClick={() => templateUploadRef.current?.click()}
                  className="px-6 py-3 bg-umak-blue text-white rounded-lg hover:bg-blue-700 transition-all font-bold font-metropolis text-sm shadow-sm"
                >
                  Choose Template File
                </button>
              </div>
            ) : (
              <CertificateCanvas
                ref={canvasRef}
                template={template}
                textElements={textElements}
                imageElements={imageElements}
                selectedElement={selectedElement}
                onSelectElement={(id: string, type: 'text' | 'image') => {
                  setSelectedElement(id)
                  setSelectedElementType(type)
                }}
                onUpdateTextElement={updateTextElement}
                onUpdateImageElement={updateImageElement}
              />
            )}
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {template && (
              <>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to change the template? This will reset element positions.')) {
                      setTemplate(null)
                      setTextElements([])
                      setImageElements([])
                      setSelectedElement(null)
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-bold font-metropolis text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Change Template
                </button>

                <button
                  onClick={addTextElement}
                  className="w-full px-4 py-3 bg-umak-yellow text-umak-blue rounded-lg hover:bg-yellow-500 transition-all font-bold font-metropolis text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Text Element
                </button>
              </>
            )}

            {selectedElement && selectedElementType === 'text' && selectedTextElement && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-umak-blue font-metropolis mb-4">
                  Text Controls
                </h3>
                <TextControls
                  element={selectedTextElement}
                  onUpdate={(updates) => updateTextElement(selectedElement, updates)}
                />
              </div>
            )}

            {template && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="text-sm font-bold text-blue-900 font-metropolis mb-2">
                  Design Tips
                </h4>
                <ul className="text-xs text-blue-800 font-metropolis space-y-1">
                  <li>• Drag elements to reposition</li>
                  <li>• Use {`{{name}}`} for recipient name</li>
                  <li>• Use {`{{title}}`} for job title</li>
                  <li>• Use {`{{date}}`} for event date</li>
                  <li>• Click element to edit properties</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <BatchGenerator
          template={template}
          textElements={textElements}
          imageElements={imageElements}
        />
      )}
    </div>
  )
}

function FormBuilderSection() {
  const forms: Form[] = [
    { id: 1, name: 'CIC Request Form', fields: 9, submissions: 273, status: 'Active', created: '2025-12-15' },
    { id: 2, name: 'Event Registration', fields: 12, submissions: 145, status: 'Active', created: '2026-01-05' },
    { id: 3, name: 'Feedback Survey', fields: 8, submissions: 89, status: 'Active', created: '2026-01-10' },
    { id: 4, name: 'Equipment Request', fields: 7, submissions: 56, status: 'Draft', created: '2026-01-20' },
  ]

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Form Builder"
        description="Create custom forms for future CIC requirements"
        actionLabel="Create New Form"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-umak-blue to-umak-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Form Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Fields</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Submissions</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold font-metropolis uppercase tracking-wider text-white">Created</th>
                <th className="px-6 py-4 text-center text-xs font-bold font-metropolis uppercase tracking-wider text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forms.map((form) => (
                <tr key={form.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 font-metropolis">{form.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{form.fields} fields</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">{form.submissions}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={form.status} type={form.status === 'Active' ? 'success' : 'neutral'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 font-metropolis">
                      {new Date(form.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <FormBuilderActions />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FeatureGrid />
    </div>
  )
}

function FormField({ label, value, onChange, type = 'text', placeholder, options, rows }: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'select' | 'date'
  placeholder?: string
  options?: string[]
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 font-metropolis mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue font-metropolis resize-none"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue font-metropolis"
        >
          <option value="">Select {label.toLowerCase()}...</option>
          {options?.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue font-metropolis"
        />
      )}
    </div>
  )
}

function TemplateCard({ template }: { template: Template }) {
  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-umak-blue hover:shadow-sm transition-all cursor-pointer group">
      <h4 className="text-sm font-bold text-gray-900 font-metropolis group-hover:text-umak-blue transition-colors">{template.name}</h4>
      <p className="text-xs text-gray-600 font-metropolis mt-1">{template.category}</p>
      <p className="text-xs text-gray-500 font-metropolis mt-2">{template.uses} uses</p>
    </div>
  )
}

function CertificateTypeCard({ cert }: { cert: CertificateType }) {
  return (
    <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-umak-blue hover:shadow-sm transition-all cursor-pointer group">
      <h4 className="text-sm font-bold text-gray-900 font-metropolis group-hover:text-umak-blue transition-colors">{cert.name}</h4>
      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-gray-500 font-metropolis">{cert.uses} generated</p>
        <StatusBadge status={cert.status} type="success" />
      </div>
    </div>
  )
}

function RecentDocuments({ type }: { type: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-umak-blue font-metropolis">Recent {type}</h3>
      </div>
      <div className="p-6">
        <div className="text-center text-gray-500 font-metropolis py-8">
          No recent documents to display
        </div>
      </div>
    </div>
  )
}

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard label="Total Generated" value="544" subtitle="All certificates" color="blue" />
      <StatCard label="This Month" value="89" subtitle="January 2026" color="green" />
      <StatCard label="This Week" value="23" subtitle="Jan 20-26" color="yellow" />
      <StatCard label="Most Used" value="234" subtitle="Participation" color="orange" />
    </div>
  )
}

function FeatureGrid() {
  const features = [
    { title: 'Field Types', items: ['Text Input', 'Email & Phone', 'Date & Time', 'Dropdowns', 'Checkboxes', 'File Upload', 'Text Area'] },
    { title: 'Validation Rules', items: ['Required Fields', 'Email Format', 'Phone Format', 'Character Limits', 'Number Ranges', 'Custom Regex', 'Conditional Logic'] },
    { title: 'Advanced Features', items: ['Multi-step Forms', 'Conditional Fields', 'Auto-save Drafts', 'Email Notifications', 'Export to Excel', 'Form Analytics', 'API Integration'] },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-umak-blue font-metropolis mb-4">{feature.title}</h3>
          <ul className="space-y-2 text-sm text-gray-700 font-metropolis">
            {feature.items.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-umak-yellow mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
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

function StatusBadge({ status, type }: { status: string; type: 'success' | 'neutral' }) {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-bold font-metropolis uppercase tracking-wide border ${colors[type]}`}>
      {status}
    </span>
  )
}

function FormBuilderActions() {
  return (
    <div className="flex justify-center gap-2">
      <button className="px-3 py-1.5 text-xs font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
        EDIT
      </button>
      <button className="px-3 py-1.5 text-xs font-bold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all font-metropolis">
        VIEW
      </button>
      <button className="px-3 py-1.5 text-xs font-bold text-gray-600 border-2 border-gray-300 hover:bg-gray-600 hover:text-white rounded-lg transition-all font-metropolis">
        COPY
      </button>
    </div>
  )
}

function StatCard({ label, value, subtitle, color }: { label: string; value: string; subtitle: string; color: 'blue' | 'green' | 'yellow' | 'orange' }) {
  const colors = {
    blue: 'border-umak-blue text-umak-blue',
    green: 'border-green-600 text-green-600',
    yellow: 'border-umak-yellow text-gray-900',
    orange: 'border-orange-500 text-orange-500',
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${colors[color].split(' ')[0]} p-6 hover:shadow-md transition-shadow`}>
      <p className="text-sm font-semibold text-gray-600 font-metropolis uppercase tracking-wide mb-2">{label}</p>
      <p className={`text-4xl font-bold font-marcellus ${colors[color].split(' ')[1]} mb-1`}>{value}</p>
      <p className="text-xs text-gray-500 font-metropolis">{subtitle}</p>
    </div>
  )
}
