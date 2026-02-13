import { prisma } from '../config/prisma.js';
import { nextNumber } from '../services/numberingService.js';

export const listReturns = async (req, res) => res.json(await prisma.return.findMany({ include: { invoice: true, items: true }, orderBy: { id: 'desc' } }));

export const createReturn = async (req, res) => {
  const result = await prisma.$transaction(async tx => {
    const number = await nextNumber(tx, 'return');
    return tx.return.create({ data: { ...req.body, number, items: { create: req.body.items.map(i => ({ ...i, lineTotal: Number(i.quantity) * Number(i.price) })) } } });
  });
  res.json(result);
};

export const postReturn = async (req, res) => {
  const id = Number(req.params.id);
  const result = await prisma.$transaction(async tx => {
    const salesReturn = await tx.return.findUnique({ where: { id }, include: { invoice: true, items: true } });
    if (!salesReturn || salesReturn.status !== 'DRAFT') throw new Error('Invalid return');
    for (const item of salesReturn.items) {
      await tx.product.update({ where: { id: item.productId }, data: { quantityOnHand: { increment: item.quantity } } });
      await tx.stockTransaction.create({ data: { type: 'RETURN', quantity: item.quantity, reference: salesReturn.number, productId: item.productId } });
    }
    await tx.customer.update({ where: { id: salesReturn.invoice.customerId }, data: { currentBalance: { decrement: salesReturn.total } } });
    return tx.return.update({ where: { id }, data: { status: 'POSTED' } });
  });
  res.json(result);
};
