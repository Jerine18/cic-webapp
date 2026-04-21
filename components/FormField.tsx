import React from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  rows?: number
  min?: string
  helpText?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options,
  rows = 6,
  min,
  helpText,
}: FormFieldProps) {
  const baseInputClasses = `w-full px-3 py-2.5 bg-white border ${
    error ? 'border-red-500' : 'border-gray-200'
  } rounded-md focus:border-umak-blue focus:ring-2 focus:ring-umak-blue/20 focus:outline-none transition-all font-metropolis text-sm`

  return (
    <div>
      <label className="block text-xs text-umak-blue mb-2 font-metropolis font-bold uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={`${baseInputClasses} leading-relaxed resize-none`}
          placeholder={placeholder}
          required={required}
        />
      ) : type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          required={required}
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClasses}
          placeholder={placeholder}
          required={required}
          min={min}
        />
      )}

      {helpText && !error && (
        <p className="text-xs text-gray-500 mt-2 font-metropolis">{helpText}</p>
      )}

      {error && <p className="text-red-500 text-xs mt-1 font-metropolis">{error}</p>}
    </div>
  )
}
