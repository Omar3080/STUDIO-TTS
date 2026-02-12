import bcrypt from 'bcryptjs';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { prisma } from '../config/prisma.js';
import { customerSchema, invoiceSchema, paymentSchema, productSchema } from '../validators/common.js';
import { nextNumber } from '../services/numberingService.js';

const listQuery = (search, field = 'name') => search ? { [field]: { contains: search } } : {};

export async function listCustomers(req, res) {
  const data = await prisma.customer.findMany({ where: { deletedAt: null, ...listQuery(req.query.search) }, orderBy: { createdAt: 'desc' } });
  res.json(data);
}
export async function createCustomer(req, res) {
  const body = customerSchema.parse(req.body);
  const data = await prisma.customer.create({ data: body });
  res.status(201).json(data);
}
export async function updateCustomer(req, res) {
  const body = customerSchema.partial().parse(req.body);
  const data = await prisma.customer.update({ where: { id: req.params.id }, data: body });
  res.json(data);
}
export async function deleteCustomer(req, res) {
  await prisma.customer.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  res.status(204).send();
}

export async function listProducts(req, res) {
  const data = await prisma.product.findMany({
    where: { deletedAt: null, ...listQuery(req.query.search) },
    include: { unit: true, category: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(data);
}
export async function createProduct(req, res) {
  const body = productSchema.parse(req.body);
  const data = await prisma.product.create({ data: body });
  res.status(201).json(data);
}
export async function updateProduct(req, res) {
  const body = productSchema.partial().parse(req.body);
  const data = await prisma.product.update({ where: { id: req.params.id }, data: body });
  res.json(data);
}
export async function deleteProduct(req, res) {
  await prisma.product.update({ where: { id: req.params.id }, data: { deletedAt: new Date() } });
  res.status(204).send();
}

function calcTotals(input) {
  const subtotal = input.items.reduce((s, i) => s + (i.quantity * i.unitPrice - i.discount), 0);
  const discountAmount = input.discountType === 'PERCENT' ? subtotal * (input.discountValue / 100) : input.discountValue;
  const taxable = subtotal - discountAmount;
  const vatAmount = taxable * (input.vatRate / 100);
  const total = taxable + vatAmount;
  return { subtotal, vatAmount, total };
}

export async function listInvoices(req, res) {
  const data = await prisma.invoice.findMany({ where: { deletedAt: null }, include: { customer: true, items: true }, orderBy: { createdAt: 'desc' } });
  res.json(data);
}

export async function createInvoice(req, res) {
  const body = invoiceSchema.parse(req.body);
  const totals = calcTotals(body);
  const number = await nextNumber('invoice');

  const invoice = await prisma.invoice.create({
    data: {
      number,
      type: body.type,
      customerId: body.customerId,
      warehouse: body.warehouse,
      paymentMethod: body.paymentMethod,
      discountType: body.discountType,
      discountValue: body.discountValue,
      vatRate: body.vatRate,
      subtotal: totals.subtotal,
      vatAmount: totals.vatAmount,
      total: totals.total,
      notes: body.notes,
      createdById: req.user.sub,
      items: {
        create: body.items.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount,
          lineTotal: i.quantity * i.unitPrice - i.discount
        }))
      }
    },
    include: { items: true }
  });

  res.status(201).json(invoice);
}

export async function postInvoice(req, res) {
  const result = await prisma.$transaction(async tx => {
    const invoice = await tx.invoice.findUnique({ where: { id: req.params.id }, include: { items: true, customer: true } });
    if (!invoice || invoice.status !== 'DRAFT') throw new Error('الفاتورة غير متاحة للترحيل');

    const settings = await tx.setting.findFirst();
    for (const item of invoice.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      const nextQty = Number(product.quantityOnHand) - Number(item.quantity);
      if (nextQty < 0 && !settings?.allowNegativeStock) throw new Error(`الكمية غير كافية للصنف ${product.name}`);
      await tx.product.update({ where: { id: item.productId }, data: { quantityOnHand: nextQty } });
      await tx.stockTransaction.create({ data: { productId: item.productId, type: 'SALE_OUT', quantity: item.quantity, reference: invoice.number } });
    }

    await tx.customer.update({ where: { id: invoice.customerId }, data: { balance: { increment: invoice.type === 'CREDIT' ? invoice.total : 0 } } });
    return tx.invoice.update({ where: { id: invoice.id }, data: { status: 'POSTED', postedAt: new Date() } });
  });

  res.json(result);
}

export async function createReturn(req, res) {
  const { invoiceId, items } = req.body;
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { items: true } });
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  const number = await nextNumber('return');
  let total = 0;
  for (const i of items) total += i.quantity * i.unitPrice;
  const created = await prisma.return.create({
    data: {
      number,
      invoiceId,
      customerId: invoice.customerId,
      createdById: req.user.sub,
      total,
      items: { create: items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice, lineTotal: i.quantity * i.unitPrice })) }
    }
  });
  res.status(201).json(created);
}

export async function postReturn(req, res) {
  const posted = await prisma.$transaction(async tx => {
    const doc = await tx.return.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!doc || doc.status !== 'DRAFT') throw new Error('Return not found or invalid');
    for (const item of doc.items) {
      await tx.product.update({ where: { id: item.productId }, data: { quantityOnHand: { increment: item.quantity } } });
      await tx.stockTransaction.create({ data: { productId: item.productId, type: 'RETURN_IN', quantity: item.quantity, reference: doc.number } });
    }
    await tx.customer.update({ where: { id: doc.customerId }, data: { balance: { decrement: doc.total } } });
    return tx.return.update({ where: { id: doc.id }, data: { status: 'POSTED', postedAt: new Date() } });
  });
  res.json(posted);
}

export async function listPayments(req, res) {
  const data = await prisma.payment.findMany({ where: { deletedAt: null }, include: { customer: true, invoice: true }, orderBy: { date: 'desc' } });
  res.json(data);
}

export async function createPayment(req, res) {
  const body = paymentSchema.parse(req.body);
  const number = await nextNumber('payment');
  const payment = await prisma.$transaction(async tx => {
    const record = await tx.payment.create({ data: { ...body, number, createdById: req.user.sub } });
    await tx.customer.update({ where: { id: body.customerId }, data: { balance: { decrement: body.amount } } });
    return record;
  });
  res.status(201).json(payment);
}

export async function dashboard(req, res) {
  const startDay = new Date(); startDay.setHours(0,0,0,0);
  const startMonth = new Date(startDay.getFullYear(), startDay.getMonth(), 1);
  const [today, month, outstanding, lowStock] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: 'POSTED', date: { gte: startDay } }, _sum: { total: true } }),
    prisma.invoice.aggregate({ where: { status: 'POSTED', date: { gte: startMonth } }, _sum: { total: true } }),
    prisma.customer.aggregate({ _sum: { balance: true } }),
    prisma.product.findMany({ where: { deletedAt: null }, select: { quantityOnHand: true, reorderLevel: true } }).then(rows => rows.filter(r => Number(r.quantityOnHand) <= Number(r.reorderLevel)).length)
  ]);
  res.json({ salesToday: today._sum.total || 0, salesMonth: month._sum.total || 0, outstanding: outstanding._sum.balance || 0, lowStock });
}

export async function salesReport(req, res) {
  const { from, to } = req.query;
  const data = await prisma.invoice.findMany({ where: { status: 'POSTED', date: { gte: new Date(from), lte: new Date(to) } }, include: { customer: true } });
  res.json(data);
}

export async function exportSalesExcel(req, res) {
  const report = await prisma.invoice.findMany({ where: { status: 'POSTED' }, include: { customer: true } });
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Sales');
  ws.columns = [
    { header: 'رقم الفاتورة', key: 'number' },
    { header: 'العميل', key: 'customer' },
    { header: 'الإجمالي', key: 'total' }
  ];
  report.forEach(r => ws.addRow({ number: r.number, customer: r.customer.name, total: r.total }));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sales.xlsx');
  await wb.xlsx.write(res);
  res.end();
}

export async function exportInvoicePdf(req, res) {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id }, include: { customer: true, items: { include: { product: true } } } });
  const doc = new PDFDocument({ margin: 30 });
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.fontSize(18).text('فاتورة مبيعات', { align: 'right' });
  doc.fontSize(12).text(`رقم: ${invoice.number}`, { align: 'right' });
  doc.text(`العميل: ${invoice.customer.name}`, { align: 'right' });
  doc.moveDown();
  invoice.items.forEach(item => doc.text(`${item.product.name} - ${item.quantity} x ${item.unitPrice} = ${item.lineTotal}`, { align: 'right' }));
  doc.moveDown().text(`الإجمالي: ${invoice.total}`, { align: 'right' });
  doc.end();
}

export async function getSettings(_req, res) {
  const settings = await prisma.setting.findFirst();
  res.json(settings);
}

export async function updateSettings(req, res) {
  const current = await prisma.setting.findFirst();
  const settings = await prisma.setting.update({ where: { id: current.id }, data: req.body });
  res.json(settings);
}


export async function listUsers(_req, res) {
  const users = await prisma.user.findMany({ where: { deletedAt: null }, include: { userRoles: { include: { role: true } } } });
  res.json(users);
}

export async function createUser(req, res) {
  const { username, password, fullName, roleId } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, passwordHash, fullName } });
  if (roleId) await prisma.userRole.create({ data: { userId: user.id, roleId } });
  res.status(201).json(user);
}

export async function listAuditLogs(_req, res) {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  res.json(logs);
}
