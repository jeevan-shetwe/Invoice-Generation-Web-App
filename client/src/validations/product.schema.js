import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product/Service name is required"),
  unitPrice: z.coerce.number().gt(0, "Unit Price must be greater than zero"),
  taxRate: z.coerce
    .number()
    .min(0)
    .max(100, "Tax Rate must be between 0 and 100"),
  category: z.string().optional(),
});
