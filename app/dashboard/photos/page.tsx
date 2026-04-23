'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

interface CompletedRequest {
  id: number
  name: string
  requestor: string
  completedDate: string
  photos: number
}

export default function PhotoDocumentationPage() {
  const [selectedRequest, setSelectedRequest] = useState<string>('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)

  const completedRequests: CompletedRequest[] = [
    { id: 1, name: 'Event Coverage - College Day', requestor: 'Student Affairs', completedDate: '2026-01-25', photos: 45 },
    { id: 2, name: 'Graduation Ceremony 2026', requestor: 'Registrar', completedDate: '2026-01-20', photos: 128 },
    { id: 3, name: 'Department Meeting Coverage', requestor: 'Engineering Dept', completedDate: '2026-01-18', photos: 32 },
    { id: 4, name: 'Sports Fest Opening', requestor: 'PE Department', completedDate: '2026-01-15', photos: 67 },
  ]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Photo Documentation Upload"
        subtitle="Upload event photos and milestone documentation"
      />
      
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <UploadSection
          selectedRequest={selectedRequest}
          setSelectedRequest={setSelectedRequest}
          completedRequests={completedRequests}
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileInput={handleFileInput}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          removeFile={removeFile}
        />

        <PhotoLibrary requests={completedRequests} />
        <StatsGrid />
      </div>
    </div>
  )
}

function UploadSection({ 
  selectedRequest, 
  setSelectedRequest, 
  completedRequests,
  dragActive,
  handleDrag,
  handleDrop,
  handleFileInput,
  uploadedFiles,
  setUploadedFiles,
  removeFile
}: {
  selectedRequest: string
  setSelectedRequest: (id: string) => void
  completedRequests: CompletedRequest[]
  dragActive: boolean
  handleDrag: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadedFiles: File[]
  setUploadedFiles: (files: File[]) => void
  removeFile: (index: number) => void
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-marcellus text-umak-blue mb-6">Upload Event Photos</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 font-metropolis mb-2">
            Select Completed Request
          </label>
          <select
            value={selectedRequest}
            onChange={(e) => setSelectedRequest(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-umak-blue focus:border-umak-blue font-metropolis"
          >
            <option value="">Choose a request to add photos...</option>
            {completedRequests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.name} - {req.requestor} ({req.completedDate})
              </option>
            ))}
          </select>
        </div>

        <DropZone
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileInput={handleFileInput}
        />

        {uploadedFiles.length > 0 && (
          <UploadedFilesPreview
            uploadedFiles={uploadedFiles}
            removeFile={removeFile}
            selectedRequest={selectedRequest}
            setUploadedFiles={setUploadedFiles}
          />
        )}
      </div>
    </div>
  )
}

function DropZone({ dragActive, handleDrag, handleDrop, handleFileInput }: {
  dragActive: boolean
  handleDrag: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-4 border-dashed rounded-xl p-12 text-center transition-all ${
        dragActive
          ? 'border-umak-blue bg-blue-50'
          : 'border-gray-300 hover:border-umak-blue hover:bg-gray-50'
      }`}
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 font-metropolis">
            Drag & Drop photos here
          </p>
          <p className="text-sm text-gray-600 font-metropolis mt-2">
            or click the button below to browse
          </p>
        </div>
        <div>
          <label className="inline-block bg-umak-yellow text-umak-blue px-8 py-3 rounded-lg hover:bg-yellow-500 transition-all font-bold font-metropolis shadow-sm cursor-pointer">
            Browse Files
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 font-metropolis">
          Supported formats: JPG, PNG, HEIC • Max 10MB per file
        </p>
      </div>
    </div>
  )
}

function UploadedFilesPreview({ uploadedFiles, removeFile, selectedRequest, setUploadedFiles }: {
  uploadedFiles: File[]
  removeFile: (index: number) => void
  selectedRequest: string
  setUploadedFiles: (files: File[]) => void
}) {
  return (
    <div className="border-2 border-umak-blue rounded-xl p-6 bg-blue-50">
      <h3 className="text-lg font-bold text-umak-blue font-metropolis mb-4">
        Uploaded Photos ({uploadedFiles.length})
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {uploadedFiles.map((file, index) => (
          <FilePreviewCard key={index} file={file} index={index} removeFile={removeFile} />
        ))}
      </div>
      
      <div className="flex gap-4 mt-6">
        <button
          disabled={!selectedRequest || uploadedFiles.length === 0}
          className="flex-1 bg-umak-blue text-white px-6 py-3 rounded-lg hover:bg-umak-blue-50 transition-all font-bold font-metropolis shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Upload All Photos
        </button>
        <button
          onClick={() => setUploadedFiles([])}
          className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all font-bold font-metropolis"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}

function FilePreviewCard({ file, index, removeFile }: {
  file: File
  index: number
  removeFile: (index: number) => void
}) {
  return (
    <div className="relative bg-white rounded-lg p-3 border-2 border-gray-200 hover:border-umak-blue transition-all group">
      <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
        {file.type.startsWith('image/') ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-2xl">FILE</div>
        )}
      </div>
      <p className="text-xs text-gray-700 font-metropolis truncate">
        {file.name}
      </p>
      <p className="text-xs text-gray-500 font-metropolis">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
      <button
        onClick={() => removeFile(index)}
        className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs hover:bg-red-700"
      >
        ×
      </button>
    </div>
  )
}

function PhotoLibrary({ requests }: { requests: CompletedRequest[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-marcellus text-umak-blue mb-6">Photo Documentation Library</h2>
      
      <div className="space-y-6">
        {requests.map((request) => (
          <PhotoRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  )
}

function PhotoRequestCard({ request }: { request: CompletedRequest }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-umak-blue transition-all">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-umak-blue font-metropolis">{request.name}</h3>
            <p className="text-sm text-gray-600 font-metropolis mt-1">
              {request.requestor} • Completed: {request.completedDate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-umak-blue font-marcellus">{request.photos}</p>
            <p className="text-xs text-gray-600 font-metropolis">photos</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-6 gap-2 mb-4">
          {Array.from({ length: Math.min(request.photos, 6) }, (_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-umak-blue to-umak-blue-50 rounded-lg flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2.5 text-sm font-bold text-umak-blue border-2 border-umak-blue hover:bg-umak-blue hover:text-white rounded-lg transition-all font-metropolis">
            View All ({request.photos})
          </button>
          <button className="flex-1 px-4 py-2.5 text-sm font-bold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all font-metropolis">
            Download ZIP
          </button>
          <button className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-600 border-2 border-gray-300 hover:bg-gray-600 hover:text-white rounded-lg transition-all font-metropolis">
            Share Link
          </button>
        </div>
      </div>
    </div>
  )
}

function StatsGrid() {
  const stats = [
    { label: 'Total Photos', value: '272', subtitle: 'All events', color: 'border-umak-blue text-umak-blue' },
    { label: 'This Month', value: '89', subtitle: 'January 2026', color: 'border-green-600 text-green-600' },
    { label: 'Storage Used', value: '2.4', subtitle: 'GB / 100 GB', color: 'border-umak-yellow text-gray-900' },
    { label: 'Recent Upload', value: 'Today', subtitle: '45 photos added', color: 'border-orange-500 text-orange-500' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-xl shadow-sm border-l-4 ${stat.color.split(' ')[0]} p-6 hover:shadow-md transition-shadow`}>
          <p className="text-sm font-semibold text-gray-600 font-metropolis uppercase tracking-wide mb-2">{stat.label}</p>
          <p className={`text-4xl font-bold font-marcellus ${stat.color.split(' ')[1]} mb-1`}>{stat.value}</p>
          <p className="text-xs text-gray-500 font-metropolis">{stat.subtitle}</p>
        </div>
      ))}
    </div>
  )
}
