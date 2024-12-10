/**
 * @file Prescription Form Schema
 * @module schemas/prescription
 * @description Zod schema for prescription form validation
 */

import * as z from 'zod'

/**
 * Prescription form validation schema
 * @constant
 */
export const prescriptionSchema = z.object({
  date: z.string({
    required_error: 'Date is required'
  }),
  medications: z.array(z.string()).min(1, 'At least one medication is required'),
  image: z.string({
    required_error: 'Prescription image is required'
  }),
  name: z.string({
    required_error: 'Prescription name is required'
  }),
  dosage: z.string({
    required_error: 'Dosage is required'
  }),
  frequency: z.string({
    required_error: 'Frequency is required'
  })
})

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema> 