import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional()
});

export const customerSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  creditLimit: z.coerce.number().optional(),
  notes: z.string().optional()
});

export const productSchema = z.object({
  sku: z.string().min(1),
  barcode: z.string().optional(),
  name: z.string().min(1),
  unitId: z.string().min(1),
  categoryId: z.string().optional().nullable(),
  salePrice: z.coerce.number().nonnegative(),
  purchasePrice: z.coerce.number().nonnegative(),
  quantityOnHand: z.coerce.number().nonnegative(),
  reorderLevel: z.coerce.number().nonnegative()
});

export const invoiceSchema = z.object({
  type: z.enum(['CASH', 'CREDIT']),
  customerId: z.string().min(1),
  warehouse: z.string().optional(),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'VISA']),
  discountType: z.enum(['PERCENT', 'AMOUNT']).default('AMOUNT'),
  discountValue: z.coerce.number().default(0),
  vatRate: z.coerce.number().default(0),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().positive(),
    unitPrice: z.coerce.number().positive(),
    discount: z.coerce.number().default(0)
  })).min(1)
});

export const paymentSchema = z.object({
  customerId: z.string().min(1),
  invoiceId: z.string().optional().nullable(),
  method: z.enum(['CASH', 'BANK_TRANSFER', 'VISA']),
  amount: z.coerce.number().positive(),
  reference: z.string().optional(),
  notes: z.string().optional()
});
