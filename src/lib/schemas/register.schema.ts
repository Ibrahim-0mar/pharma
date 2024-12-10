/**
 * @file Registration Form Schema
 * @module schemas/register
 * @description Zod schema for registration form validation
 */

import * as z from 'zod';

/**
 * Registration form validation schema
 * @constant
 * @type {z.ZodObject<RegisterFormValues>}
 * Validates:
 * - User type (pharmacist/doctor)
 * - Email format
 * - Password complexity
 * - Password confirmation match
 * - Personal details (name, gender, DOB)
 * - Physical measurements (height, weight)
 */
export const registerSchema = z
  .object({
    userType: z.enum(['pharmacist', 'doctor'], {
      required_error: 'Please select a user type',
    }),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters'),
    gender: z.enum(['male', 'female'], {
      required_error: 'Please select a gender',
    }),
    dob: z.string({
      required_error: 'Please select a date of birth',
    }),
    height: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Height must be a positive number',
      }),
    weight: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Weight must be a positive number',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

/**
 * TypeScript type for registration form values
 * @typedef {z.infer<typeof registerSchema>} RegisterFormValues
 */
export type RegisterFormValues = z.infer<typeof registerSchema>;
