import ExcelJS from 'exceljs';
import { prisma } from '../config/prisma.js';

export const listProducts = async (req, res) => res.json(await prisma.product.findMany({ where: { deletedAt: null }, include: { category: true, unit: true }, orderBy: { id: 'desc' } }));
export const createProduct = async (req, res) => res.json(await prisma.product.create({ data: req.body }));
export const updateProduct = async (req, res) => res.json(await prisma.product.update({ where: { id: Number(req.params.id) }, data: req.body }));
export const deleteProduct = async (req, res) => res.json(await prisma.product.update({ where: { id: Number(req.params.id) }, data: { deletedAt: new Date() } }));
export const exportProducts = async (req, res) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Products');
  ws.columns = [{ header: 'SKU', key: 'sku' }, { header: 'Name', key: 'name' }, { header: 'Qty', key: 'quantityOnHand' }];
  (await prisma.product.findMany({ where: { deletedAt: null } })).forEach(p => ws.addRow(p));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  await wb.xlsx.write(res);
  res.end();
};
