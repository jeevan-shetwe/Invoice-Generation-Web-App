import { z } from 'zod';
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  unitPrice: z.number().gt(0, 'Unit price must be greater than zero'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100')
});
