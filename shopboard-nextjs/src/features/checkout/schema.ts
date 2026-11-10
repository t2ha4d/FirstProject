import { z } from 'zod'

/** Every checkout validation rule lives here; the form type is inferred from it (see types.ts). */
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Enter your full name, at least 2 characters.')
    .max(80, 'Your name can be at most 80 characters.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .pipe(z.email('Enter a valid email address, like name@example.com.')),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()-]{7,20}$/, 'Enter a phone number of 7 to 20 digits, like +1 555 123 4567.'),
  address: z.string().trim().min(5, 'Enter your street address and house number.'),
  city: z.string().trim().min(2, 'Enter your city.'),
  postalCode: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z\d][A-Za-z\d -]{1,8}[A-Za-z\d]$/,
      'Enter a postal code of 3 to 10 letters or digits.',
    ),
})
