'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { findService } from '@/lib/services'
import { useRequestForm } from '@/hooks/useRequestForm'
import RequestForm from '@/components/RequestForm'
import UserPageHeader from '@/components/user/UserPageHeader'

export default function SubmitRequestFormPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = use(params)
  const router = useRouter()
  const service = findService(type)

  const {
    formData,
    errors,
    isSubmitting,
    handleTypeSelect,
    handleInputChange,
    handleSubmit,
    successMessage,
    clearSuccessMessage,
  } = useRequestForm()

  useEffect(() => {
    if (!service) {
      router.replace('/usersubmitrequest')
      return
    }
    handleTypeSelect(service.serviceType)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  if (!service) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F7FA] via-white to-[#FFF4CC]">
      <UserPageHeader title="Submit a New Request" hideBottomBorder />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={() => router.push('/usersubmitrequest')}
          className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg text-sm font-metropolis font-semibold text-umak-blue hover:bg-umak-blue hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Services
        </button>

        {successMessage ? (
          <div className="bg-white rounded-xl shadow-md p-8 sm:p-10 text-center font-metropolis">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-marcellus text-umak-blue mb-4">
              Request Submitted
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-8">{successMessage}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={clearSuccessMessage}
                className="px-6 py-3 bg-umak-blue text-white rounded-lg font-semibold text-xs uppercase tracking-widest hover:bg-blue-900 transition-colors"
              >
                Submit Another Request
              </button>
              <button
                onClick={() => router.push('/usermyrequests')}
                className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-xs uppercase tracking-widest hover:border-umak-blue hover:text-umak-blue transition-colors"
              >
                View My Requests
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="text-xs font-metropolis font-bold text-umak-blue uppercase tracking-widest mb-3">
                Request Form
              </div>
              <h2 className="text-3xl sm:text-4xl font-marcellus text-umak-blue mb-3 leading-snug">
                {service.title} Request
              </h2>
              <p className="text-gray-500 font-metropolis text-sm">
                Complete all required fields to submit your request.
              </p>
            </div>

            <RequestForm
              formData={formData}
              errors={errors}
              isSubmitting={isSubmitting}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/usersubmitrequest')}
            />
          </>
        )}
      </div>
    </div>
  )
}
