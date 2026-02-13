import { prisma } from '../config/prisma.js';

export const listCustomers = async (req, res) => {
  const search = req.query.search || '';
  const data = await prisma.customer.findMany({ where: { deletedAt: null, OR: [{ name: { contains: search } }, { code: { contains: search } }] }, orderBy: { id: 'desc' } });
  res.json(data);
};
export const createCustomer = async (req, res) => res.json(await prisma.customer.create({ data: req.body }));
export const updateCustomer = async (req, res) => res.json(await prisma.customer.update({ where: { id: Number(req.params.id) }, data: req.body }));
export const deleteCustomer = async (req, res) => res.json(await prisma.customer.update({ where: { id: Number(req.params.id) }, data: { deletedAt: new Date() } }));
