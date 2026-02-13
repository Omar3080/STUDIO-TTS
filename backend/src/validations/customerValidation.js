import { z } from 'zod';
export const customerSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  creditLimit: z.coerce.number().default(0),
  notes: z.string().optional()
});
