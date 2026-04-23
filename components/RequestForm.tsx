'use client'

import React, { useState } from 'react'
import { FormData, FormErrors } from '@/lib/types'
import FormField from './FormField'
import SearchableSelect from './SearchableSelect'
import SubmitConfirmModal from './SubmitConfirmModal'
import { OFFICE_GROUPS } from '@/lib/offices'

interface RequestFormProps {
  serviceType: string
  formData: FormData
  errors: FormErrors
  isSubmitting: boolean
  submissionError?: string
  onInputChange: (name: keyof FormData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const subsectionHeaderClass =
  'text-sm font-metropolis font-bold uppercase tracking-widest text-umak-blue mb-4 pb-2 border-b border-[#001A41]/10'

// Section card wrapper with a gray header bar + colored vertical accent bar.
function SectionCard({
  title,
  accent,
  children,
}: {
  title: string
  accent: 'blue' | 'yellow'
  children: React.ReactNode
}) {
  const borderClass =
    accent === 'blue' ? 'border-l-umak-blue' : 'border-l-umak-yellow'
  const barClass = accent === 'blue' ? 'bg-umak-blue' : 'bg-umak-yellow'

  return (
    <div
      className={`bg-white border border-gray-200 border-l-4 ${borderClass} rounded-2xl overflow-hidden mb-4`}
    >
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
        <span
          className={`w-1 h-5 rounded-full ${barClass} inline-block mr-3`}
          aria-hidden="true"
        />
        <span className="text-xs font-bold text-umak-blue uppercase tracking-widest font-metropolis">
          {title}
        </span>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  )
}

export default function RequestForm({
  serviceType,
  formData,
  errors,
  isSubmitting,
  submissionError,
  onInputChange,
  onSubmit,
  onCancel,
}: RequestFormProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const isCorporateRequisites = serviceType === 'design'

  // Intercept form submit → open the confirmation modal instead of submitting directly.
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
    } as unknown as React.FormEvent
    onSubmit(syntheticEvent)
    setShowConfirm(false)
  }

  // If the parent surfaces a submissionError while the confirm modal is still
  // open (submit failed), close the modal so the error banner is visible.
  React.useEffect(() => {
    if (submissionError) setShowConfirm(false)
  }, [submissionError])

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <p className="text-xs text-gray-400 mb-4 font-metropolis">
          <span className="text-red-500">*</span> Indicates a required field
        </p>

        {/* Card 1 — Requestor Information */}
        <SectionCard title="Requestor Information" accent="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(value) => onInputChange('name', value)}
              error={errors.name}
              required
              preFilled
            />
            <FormField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(value) => onInputChange('email', value)}
              error={errors.email}
              required
              preFilled
            />
            <FormField
              label="Contact Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(value) => onInputChange('phone', value)}
              error={errors.phone}
              required
              placeholder="09XX XXX XXXX"
            />
            <SearchableSelect
              label="Offices / College / Institution"
              value={formData.department}
              onChange={(value) => onInputChange('department', value)}
              error={errors.department}
              required
              placeholder="Type to search or click to browse..."
              optionGroups={OFFICE_GROUPS}
            />
          </div>
        </SectionCard>

        {/* Card 2 — Request Details */}
        <SectionCard title="Request Details" accent="blue">
          {isCorporateRequisites ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  label="Type of Corporate Requisite"
                  name="corporateRequisiteType"
                  type="select"
                  value={formData.corporateRequisiteType || ''}
                  onChange={(value) => onInputChange('corporateRequisiteType', value)}
                  error={errors.corporateRequisiteType}
                  required
                  placeholder="Select a type"
                  options={[
                    { value: 'Medals', label: 'Medals' },
                    { value: 'Plaques', label: 'Plaques' },
                    {
                      value: 'Standardized Corporate Giveaways',
                      label: 'Standardized Corporate Giveaways',
                    },
                    { value: 'Trophies', label: 'Trophies' },
                  ]}
                />
                <FormField
                  label="Event Name"
                  name="eventName"
                  type="text"
                  value={formData.eventName || ''}
                  onChange={(value) => onInputChange('eventName', value)}
                  error={errors.eventName}
                  required
                  placeholder="e.g., Foundation Day Awarding"
                />
                <FormField
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate || ''}
                  onChange={(value) => onInputChange('eventDate', value)}
                  error={errors.eventDate}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
                <FormField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  inputMode="numeric"
                  value={formData.quantity || ''}
                  onChange={(value) =>
                    onInputChange('quantity', value.replace(/[^0-9]/g, ''))
                  }
                  error={errors.quantity}
                  required
                  placeholder="e.g., 10"
                  min="1"
                />
              </div>

              <div className="mt-5">
                <FormField
                  label="Draft Citation"
                  name="draftCitation"
                  type="textarea"
                  value={formData.draftCitation || ''}
                  onChange={(value) => onInputChange('draftCitation', value)}
                  error={errors.draftCitation}
                  required
                  rows={3}
                  resize="vertical"
                  minHeight="80px"
                  placeholder="Enter the draft citation..."
                  helpText="For plaques, please indicate the draft citation. Type N/A if not applicable."
                />
              </div>
            </>
          ) : (
            <div className="space-y-8">
              {/* Generic request details */}
              <div>
                <h3 className={subsectionHeaderClass}>Detailed Description</h3>
                <FormField
                  label="Detailed Description"
                  name="requestDetails"
                  type="textarea"
                  value={formData.requestDetails}
                  onChange={(value) => onInputChange('requestDetails', value)}
                  error={errors.requestDetails}
                  required
                  rows={6}
                  placeholder="Please provide comprehensive details about your request, including specific requirements, dimensions, format preferences, and any other relevant information..."
                />
                <p className="text-xs text-gray-500 font-metropolis mt-2">
                  {errors.requestDetails ? (
                    <span className="text-red-500">{errors.requestDetails}</span>
                  ) : (
                    `${formData.requestDetails.length}/1000 characters (min. 50)`
                  )}
                </p>
              </div>

              <div>
                <h3 className={subsectionHeaderClass}>Target Deadline</h3>
                <FormField
                  label="Target Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(value) => onInputChange('deadline', value)}
                  error={errors.deadline}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  helpText="Standard processing time is 5-7 business days"
                />
              </div>

              <div>
                <h3 className={subsectionHeaderClass}>Attach Content</h3>
                <label
                  htmlFor="request-attachment"
                  className="block text-sm text-gray-700 mb-1.5 font-metropolis font-semibold"
                >
                  Attach Files (Optional)
                </label>
                <label
                  htmlFor="request-attachment"
                  className="block border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-umak-blue hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <div className="text-gray-400 mb-3">
                    <svg
                      className="w-12 h-12 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-metropolis font-medium mb-2 text-sm">
                    Click to browse or drag and drop files here
                  </p>
                  <p className="text-xs text-gray-500 font-metropolis">
                    Supported formats: PNG, JPEG, PDF · Maximum file size: 10MB
                  </p>
                  <input
                    id="request-attachment"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,application/pdf"
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
          )}
        </SectionCard>

        {submissionError && (
          <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm font-metropolis text-red-700">
            <span aria-hidden="true" className="text-red-500">⚠</span>
            <div>
              <p className="font-semibold">We couldn&apos;t submit your request.</p>
              <p className="mt-0.5 text-red-600">{submissionError}</p>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-6 py-5 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-400 font-metropolis hover:border-gray-300 hover:text-gray-600 transition-all"
          >
            ← Back
          </button>
          <span className="hidden sm:inline text-xs text-gray-400 font-metropolis">
            All fields marked * are required
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-umak-yellow text-umak-blue border-2 border-umak-yellow rounded-lg text-sm font-bold font-metropolis shadow-md hover:bg-umak-blue hover:text-umak-yellow hover:border-umak-yellow hover:shadow-lg active:bg-umak-blue active:text-umak-yellow active:border-umak-yellow transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request →'}
          </button>
        </div>
      </form>

      <SubmitConfirmModal
        open={showConfirm}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
