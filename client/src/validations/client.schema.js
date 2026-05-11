import * as z from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Company/Name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email address format'),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/m.test(val),
      'Phone number must be in a valid format (e.g., +1-234-567-8900 or (123) 456-7890)'
    ),
  address: z.string().min(1, 'Address is required')
});