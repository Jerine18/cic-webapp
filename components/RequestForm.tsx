'use client'

import React from 'react'
import { FormData, FormErrors } from '@/lib/types'
import FormField from './FormField'

interface RequestFormProps {
  formData: FormData
  errors: FormErrors
  isSubmitting: boolean
  onInputChange: (name: keyof FormData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const sectionHeaderClass =
  'text-sm font-metropolis font-bold uppercase tracking-widest text-umak-blue mb-4 pb-2 border-b border-[#001A41]/10'

export default function RequestForm({
  formData,
  errors,
  isSubmitting,
  onInputChange,
  onSubmit,
  onCancel,
}: RequestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Requestor Information */}
      <div>
        <h3 className={sectionHeaderClass}>Requestor Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(value) => onInputChange('name', value)}
            error={errors.name}
            required
            placeholder="Juan Dela Cruz"
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={(value) => onInputChange('email', value)}
            error={errors.email}
            required
            placeholder="juan.delacruz@umak.edu.ph"
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
          <FormField
            label="Department/Office"
            name="department"
            type="text"
            value={formData.department}
            onChange={(value) => onInputChange('department', value)}
            error={errors.department}
            required
            placeholder="e.g., College of Engineering"
          />
        </div>
      </div>

      {/* Request Details */}
      <div>
        <h3 className={sectionHeaderClass}>Request Details</h3>
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

      {/* Timeline & Priority */}
      <div>
        <h3 className={sectionHeaderClass}>Timeline &amp; Priority</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
          <FormField
            label="Priority Level"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={(value) =>
              onInputChange('priority', value as 'Low' | 'Medium' | 'High')
            }
            required
            options={[
              { value: 'Low', label: 'Low Priority - Flexible timeline (1-2 weeks)' },
              { value: 'Medium', label: 'Medium Priority - Standard processing (5-7 days)' },
              { value: 'High', label: 'High Priority - Urgent request (2-3 days)' },
            ]}
          />
        </div>
      </div>

      {/* Supporting Documents */}
      <div>
        <h3 className={sectionHeaderClass}>Supporting Documents</h3>
        <label className="block text-xs text-umak-blue mb-2 font-metropolis font-bold uppercase tracking-widest">
          Attach Files (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-umak-blue hover:bg-blue-50/50 transition-all cursor-pointer">
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
            Supported formats: PDF, DOC, DOCX, JPG, PNG · Maximum file size: 10MB
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
        <h4 className="text-sm font-bold text-umak-blue font-metropolis mb-3">
          Please read carefully:
        </h4>
        <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600 font-metropolis leading-relaxed">
          <li>
            We process all service and event booking requests on a first-come,
            first-served basis, subject to availability on the CIC Calendar. Please
            submit your form at least one week in advance of your event.
          </li>
          <li>
            To ensure your request is processed smoothly, your office must provide all
            complete requirements at the time of submission. Requests with incomplete
            details will be put on hold until all necessary information is provided.
          </li>
          <li>
            The estimated turnaround time is based on your initial request. Please
            note that any further revisions or changes may cause delays in the delivery
            of materials.
          </li>
          <li>
            By submitting this request form, you agree and provide all the information
            requested and the terms and conditions provided.
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end items-stretch sm:items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-white border-2 border-umak-blue text-umak-blue rounded-lg hover:bg-umak-blue hover:text-white transition-all font-metropolis font-bold text-xs uppercase tracking-widest"
        >
          Cancel Request
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-umak-yellow text-umak-blue rounded-lg hover:bg-yellow-400 transition-all font-metropolis font-bold text-xs uppercase tracking-widest shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </button>
      </div>
    </form>
  )
}
