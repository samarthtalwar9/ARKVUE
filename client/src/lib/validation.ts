import type { LeadInput } from '../types'

export type FormErrors = Partial<Record<keyof LeadInput, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Keeps the last 10 digits (strips +91, spaces, dashes). */
export const phoneDigits = (raw: string): string => raw.replace(/\D/g, '').slice(-10)

export const formatPhone = (raw: string): string => {
  const d = phoneDigits(raw)
  return d.length === 10 ? `+91 ${d.slice(0, 5)} ${d.slice(5)}` : raw.trim()
}

export const normalizeEmail = (email: string): string => email.trim().toLowerCase()

export function validateLead(input: LeadInput): FormErrors {
  const errors: FormErrors = {}
  if (input.name.trim().length < 2) errors.name = 'Enter the lead’s full name'
  if (input.company.trim().length < 2) errors.company = 'Enter a company name'
  if (!EMAIL_RE.test(input.email.trim())) errors.email = 'Enter a valid email address'
  const digits = input.phone.replace(/\D/g, '')
  const tenDigits = digits.slice(-10)
  if (digits.length < 10 || digits.length > 12 || !/^[6-9]\d{9}$/.test(tenDigits)) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }
  return errors
}
