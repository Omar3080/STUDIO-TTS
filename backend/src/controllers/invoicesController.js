import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { nextNumber } from '../services/numberingService.js';

const calcTotals = (items, discountValue = 0, vatRate = 0) => {
  const subtotal = items.reduce((s, i) => s + Number(i.quantity) * Number(i.price) - Number(i.discount || 0), 0);
  const afterDiscount = subtotal - Number(discountValue || 0);
  const total = afterDiscount + (afterDiscount * Number(vatRate || 0)) / 100;
  return { subtotal, total };
};

export const listInvoices = async (req, res) => res.json(await prisma.invoice.findMany({ where: { deletedAt: null }, include: { customer: true, items: { include: { product: true } } }, orderBy: { id: 'desc' } }));

export const createInvoice = async (req, res) => {
  const { customerId, items, ...rest } = req.body;
  const { subtotal, total } = calcTotals(items, rest.discountValue, rest.vatRate);
  const invoice = await prisma.$transaction(async tx => {
    const number = await nextNumber(tx, 'invoice');
    return tx.invoice.create({
      data: {
        ...rest,
        number,
        customerId,
        subtotal,
        total,
        items: { create: items.map(i => ({ ...i, lineTotal: Number(i.quantity) * Number(i.price) - Number(i.discount || 0) })) }
      },
      include: { items: true }
    });
  });
  res.json(invoice);
};

export const postInvoice = async (req, res) => {
  const id = Number(req.params.id);
  const result = await prisma.$transaction(async tx => {
    const invoice = await tx.invoice.findUnique({ where: { id }, include: { items: true } });
    if (!invoice || invoice.status !== 'DRAFT') throw new Error('Invalid invoice status');
    const setting = await tx.setting.findFirst({ where: { id: 1 } });
    for (const item of invoice.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      const newQty = Number(product.quantityOnHand) - Number(item.quantity);
      if (!setting?.allowNegativeStock && newQty < 0) throw new Error(`Insufficient stock for product ${item.productId}`);
      await tx.product.update({ where: { id: item.productId }, data: { quantityOnHand: newQty } });
      await tx.stockTransaction.create({ data: { type: 'SALE', quantity: item.quantity, reference: invoice.number, productId: item.productId } });
    }
    await tx.customer.update({ where: { id: invoice.customerId }, data: { currentBalance: { increment: invoice.total } } });
    return tx.invoice.update({ where: { id }, data: { status: 'POSTED' } });
  });
  res.json(result);
};

export const invoicePdf = async (req, res) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) }, include: { customer: true, items: { include: { product: true } } } });
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.fontSize(18).text('فاتورة بيع', { align: 'right' });
  doc.text(`رقم: ${invoice.number}`, { align: 'right' });
  doc.text(`العميل: ${invoice.customer.name}`, { align: 'right' });
  invoice.items.forEach(it => doc.text(`${it.product.name} - الكمية ${it.quantity} - السعر ${it.price}`, { align: 'right' }));
  doc.text(`الإجمالي: ${invoice.total}`, { align: 'right' });
  doc.end();
};
