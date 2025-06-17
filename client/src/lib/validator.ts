import { z } from 'zod'

export const guestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\d{10,13}$/, 'Phone must be 10-13 digits'),
  idCard: z.string().min(12, 'ID Card must be at least 12 characters').max(20, 'ID Card must be at most 20 characters'),
  remark: z.enum(['Meeting', 'Interview', 'Delivery', 'Other'])
})

export type GuestFormData = z.infer<typeof guestSchema>