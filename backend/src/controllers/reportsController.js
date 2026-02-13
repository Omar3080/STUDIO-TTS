import { prisma } from '../config/prisma.js';

export const dashboard = async (req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  const [salesToday, salesMonth, outstanding, lowStock] = await Promise.all([
    prisma.invoice.aggregate({ where: { status: 'POSTED', date: { gte: today } }, _sum: { total: true } }),
    prisma.invoice.aggregate({ where: { status: 'POSTED', date: { gte: month } }, _sum: { total: true } }),
    prisma.customer.aggregate({ _sum: { currentBalance: true } }),
    prisma.product.count({ where: { quantityOnHand: { lte: prisma.product.fields.reorderLevel }, deletedAt: null } }).catch(() => 0)
  ]);
  res.json({ salesToday: salesToday._sum.total || 0, salesMonth: salesMonth._sum.total || 0, outstanding: outstanding._sum.currentBalance || 0, lowStock });
};

export const customerBalances = async (req, res) => res.json(await prisma.customer.findMany({ where: { deletedAt: null }, select: { code: true, name: true, currentBalance: true } }));
export const unpaidInvoices = async (req, res) => res.json(await prisma.invoice.findMany({ where: { status: 'POSTED' }, include: { payments: true } }));
export const inventoryReport = async (req, res) => res.json(await prisma.product.findMany({ where: { deletedAt: null }, select: { sku: true, name: true, quantityOnHand: true, reorderLevel: true } }));
