import * as z from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Company/Name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional()
});
