/**
 * @file Login Form Schema
 * @module schemas/login
 * @description Zod schema for login form validation
 */

import * as z from 'zod'

/**
 * Login form validation schema
 * @constant
 */
export const loginSchema = z.object({
  userType: z.enum(['pharmacist', 'doctor'], {
    required_error: 'Please select a user type'
  }),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false)
})

export type LoginFormValues = z.infer<typeof loginSchema> 