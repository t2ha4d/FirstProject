import type { HTMLInputTypeAttribute } from 'react'
import type { CheckoutValues } from './types'

interface CheckoutField {
  name: keyof CheckoutValues
  label: string
  type: HTMLInputTypeAttribute
  /** The browser autofill token for this field. */
  autoComplete: string
}

/** The checkout inputs in display order. */
export const CHECKOUT_FIELDS: CheckoutField[] = [
  { name: 'fullName', label: 'Full name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel' },
  { name: 'address', label: 'Street address', type: 'text', autoComplete: 'address-line1' },
  { name: 'city', label: 'City', type: 'text', autoComplete: 'address-level2' },
  { name: 'postalCode', label: 'Postal code', type: 'text', autoComplete: 'postal-code' },
]

export const EMPTY_CHECKOUT: CheckoutValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}
