import { z } from 'zod';
export const productSchema = z.object({
  sku: z.string(), barcode: z.string(), name: z.string(), sellingPrice: z.coerce.number(), purchasePrice: z.coerce.number(), quantityOnHand: z.coerce.number(), reorderLevel: z.coerce.number().default(0), categoryId: z.coerce.number().optional(), unitId: z.coerce.number().optional()
});
