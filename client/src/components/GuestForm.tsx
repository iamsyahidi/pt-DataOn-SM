'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { submitGuest } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Schema validasi dengan Zod
const guestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\d{10,13}$/, 'Phone must be 10-13 digits'),
  idCard: z.string().min(12, 'ID Card must be at least 12 characters').max(20, 'ID Card must be at most 20 characters'),
  remark: z.enum(['Meeting', 'Interview', 'Delivery', 'Other'])
})

type FormData = z.infer<typeof guestSchema>

export default function GuestForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    
    try {
      // Validasi data
      const validatedData = guestSchema.parse(formData)
      
      // Kirim ke API
      const response = await submitGuest(validatedData)
      
      if (response.success) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          router.push('/guests')
        }, 2000)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setErrors({ general: 'Failed to submit form. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          Guest registered successfully!
        </div>
      )}
      
      {errors.general && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          hasError={!!errors.name}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          hasError={!!errors.email}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          hasError={!!errors.phone}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>
      
      <div>
        <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">
          ID Card Number
        </label>
        <Input
          type="text"
          id="idCard"
          name="idCard"
          value={formData.idCard || ''}
          onChange={handleChange}
          hasError={!!errors.idCard}
        />
        {errors.idCard && <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>}
      </div>
      
      <div>
        <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
          Remark of Visit
        </label>
        <select
          id="remark"
          name="remark"
          value={formData.remark || ''}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
            errors.remark ? 'border-red-500' : 'border-gray-300'
          } p-2`}
        >
          <option value="">Select remark</option>
          <option value="Meeting">Meeting</option>
          <option value="Interview">Interview</option>
          <option value="Delivery">Delivery</option>
          <option value="Other">Other</option>
        </select>
        {errors.remark && <p className="mt-1 text-sm text-red-600">{errors.remark}</p>}
      </div>
      
      <div className="pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Guest'}
        </Button>
      </div>
    </form>
  )
}