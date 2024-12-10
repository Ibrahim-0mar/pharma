/**
 * @file Profile Form Schema
 * @module schemas/profile
 * @description Zod schema for profile form validation
 */

import * as z from 'zod'

/**
 * Profile form validation schema
 * @constant
 */
export const profileSchema = z.object({
  userType: z.enum(['pharmacist', 'doctor'], {
    required_error: 'User type is required'
  }),
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  gender: z.enum(['male', 'female'], {
    required_error: 'Please select a gender'
  }),
  dob: z.string({
    required_error: 'Date of birth is required'
  }),
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Height must be a positive number'
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Weight must be a positive number'
  })
})

export type ProfileFormValues = z.infer<typeof profileSchema> 