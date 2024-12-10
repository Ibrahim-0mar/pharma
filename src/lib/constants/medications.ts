/**
 * @file Medication Options Constants
 * @module constants/medications
 */

/**
 * List of available medications
 * @constant
 */
export const MEDICATION_OPTIONS = [
  'Ibuprofen', 'Aspirin', 'Paracetamol', 'Amoxicillin',
  'Metformin', 'Omeprazole', 'Lipitor', 'Lisinopril',
  'Levothyroxine', 'Azithromycin', 'Albuterol', 'Ciprofloxacin',
  'Losartan', 'Atorvastatin', 'Gabapentin', 'Prednisone',
  'Hydrochlorothiazide', 'Zoloft', 'Sertraline', 'Xanax',
] as const;

export type MedicationType = typeof MEDICATION_OPTIONS[number]; 