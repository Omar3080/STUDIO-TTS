import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

export const listUsers = async (req, res) => res.json(await prisma.user.findMany({ where: { deletedAt: null }, include: { userRoles: { include: { role: true } } } }));
export const createUser = async (req, res) => {
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = await prisma.user.create({ data: { username: req.body.username, fullName: req.body.fullName, passwordHash } });
  res.json(user);
};
