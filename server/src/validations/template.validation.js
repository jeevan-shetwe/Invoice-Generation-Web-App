import { z } from 'zod';

export const templateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  branding: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    textColor: z.string().optional(),
    logoUrl: z.string().optional().or(z.literal(''))
  }).optional(),
  fields: z.object({
    showTax: z.boolean().optional(),
    notesLabel: z.string().optional()
  }).optional()
});
