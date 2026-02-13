import { prisma } from '../config/prisma.js';
import { nextNumber } from '../services/numberingService.js';

export const listPayments = async (req, res) => res.json(await prisma.payment.findMany({ include: { customer: true, invoices: true }, orderBy: { id: 'desc' } }));

export const createPayment = async (req, res) => {
  const result = await prisma.$transaction(async tx => {
    const number = await nextNumber(tx, 'payment');
    const payment = await tx.payment.create({
      data: {
        number,
        customerId: req.body.customerId,
        amount: req.body.amount,
        method: req.body.method,
        notes: req.body.notes,
        invoices: { create: (req.body.invoiceAllocations || []).map(i => ({ invoiceId: i.invoiceId, amount: i.amount })) }
      }
    });
    await tx.customer.update({ where: { id: req.body.customerId }, data: { currentBalance: { decrement: req.body.amount } } });
    return payment;
  });
  res.json(result);
};
