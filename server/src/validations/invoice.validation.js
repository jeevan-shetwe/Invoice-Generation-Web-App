import { z } from 'zod';

export const invoiceCreateSchema = z.object({
  clientId: z.coerce.number().positive('Valid Client ID is required'),
  templateId: z.coerce.number().positive('Valid Template ID is required'),
  issueDate: z.string().min(1, 'Issue Date is required'),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    productId: z.coerce.number().positive(),
    name: z.string().min(1),
    quantity: z.coerce.number().positive('Quantity must be greater than zero'),
    unitPrice: z.coerce.number().positive('Price must be greater than zero'),
    taxRate: z.coerce.number().min(0).max(100)
  })).min(1, 'At least one item is required'),
  isRecurring: z.boolean().optional(),
  recurringInterval: z.enum(['Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom']).optional().nullable(),
  recurringIntervalValue: z.number().int().positive().optional().nullable(),
  nextRecurrenceDate: z.string().optional().nullable()
});

export const invoiceStatusSchema = z.object({
  status: z.enum(['Draft', 'Finalised', 'Paid', 'Cancelled'])
});
