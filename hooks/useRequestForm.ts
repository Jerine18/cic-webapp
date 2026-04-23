'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { FormData, FormErrors } from '@/lib/types'
import {
  requestFormSchema,
  corporateRequisitesSchema,
} from '@/lib/validation'
import { INITIAL_FORM_DATA } from '@/lib/constants'
import { supabaseClient } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { getDisplayName } from '@/lib/get-display-name'

export function useRequestForm() {
  const { user, profile } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [submissionError, setSubmissionError] = useState('')

  // Auto-populate name + email from the logged-in user once auth resolves.
  useEffect(() => {
    if (!user) return
    const displayName = getDisplayName(user, profile)
    setFormData((prev) => ({
      ...prev,
      name: prev.name || displayName,
      email: prev.email || user.email || '',
    }))
  }, [user, profile])

  const getSchemaForType = (typeId: string) => {
    if (typeId === 'design') return corporateRequisitesSchema
    return requestFormSchema
  }

  const validateField = (name: keyof FormData, value: string): void => {
    const schema = getSchemaForType(selectedType)
    const fieldSchema = (schema.shape as Record<string, z.ZodType | undefined>)[name]
    if (!fieldSchema) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
      return
    }
    try {
      fieldSchema.parse(value)
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.issues[0].message }))
      }
    }
  }

  const handleTypeSelect = (typeId: string): void => {
    setSelectedType(typeId)
    setStep(2)
  }

  const handleInputChange = (name: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleCancel = (): void => {
    setStep(1)
    setSelectedType('')
    setErrors({})
  }

  const resetForm = (): void => {
    setStep(1)
    setSelectedType('')
    setFormData({
      ...INITIAL_FORM_DATA,
      name: user ? getDisplayName(user, profile) : '',
      email: user?.email || '',
    })
    setErrors({})
  }

  // Build the Supabase row payload based on selected service type.
  const buildSubmissionPayload = (validated: Record<string, unknown>) => {
    const base = {
      name: validated.name,
      email: validated.email,
      phone: validated.phone,
      department: validated.department,
      type: selectedType,
      status: 'Pending',
      user_id: user?.id ?? null,
    }

    if (selectedType === 'design') {
      return {
        ...base,
        // Stash the service-specific fields in `details` as a structured blob
        // so we don't need a schema migration. Admin view can parse as JSON.
        details: JSON.stringify({
          corporateRequisiteType: validated.corporateRequisiteType,
          eventName: validated.eventName,
          eventDate: validated.eventDate,
          quantity: validated.quantity,
          draftCitation: validated.draftCitation,
        }),
        deadline: validated.eventDate,
        // Priority is no longer user-facing; write a default so the (non-nullable)
        // DB column stays happy without a schema migration.
        priority: 'Medium',
      }
    }

    return {
      ...base,
      details: validated.requestDetails,
      deadline: validated.deadline,
      priority: 'Medium',
    }
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSuccessMessage('')
    setSubmissionError('')

    try {
      const schema = getSchemaForType(selectedType)
      const validatedData = schema.parse(formData) as Record<string, unknown>

      // Guard: we need an authenticated user to stamp user_id on the row so the
      // dashboards (which filter by user_id) can show it back to them. If the
      // session isn't loaded yet, fail loudly instead of writing a null user_id.
      if (!user?.id) {
        throw new Error(
          'You are not signed in. Please refresh the page and try again.',
        )
      }

      if (supabaseClient) {
        const payload = buildSubmissionPayload(validatedData)
        const { data, error: submitError } = await supabaseClient
          .from('submissions')
          .insert(payload)
          .select()

        if (submitError) throw submitError
        // eslint-disable-next-line no-console
        console.log('[useRequestForm] submission inserted:', data)
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      }

      setSuccessMessage(
        'Request submitted successfully! Our team will review and contact you within 24-48 hours.',
      )
      resetForm()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof FormData] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        // eslint-disable-next-line no-console
        console.error('[useRequestForm] submission failed:', error)
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? String((error as { message: unknown }).message)
              : 'Submission failed. Please try again.'
        setSubmissionError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    step,
    selectedType,
    formData,
    errors,
    isSubmitting,
    handleTypeSelect,
    handleInputChange,
    handleCancel,
    handleSubmit,
    successMessage,
    submissionError,
    clearSubmissionError: () => setSubmissionError(''),
    clearSuccessMessage: () => setSuccessMessage(''),
  }
}
