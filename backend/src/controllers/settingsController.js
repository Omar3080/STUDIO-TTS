import { prisma } from '../config/prisma.js';
export const getSettings = async (req, res) => res.json(await prisma.setting.findFirst({ where: { id: 1 } }));
export const updateSettings = async (req, res) => res.json(await prisma.setting.upsert({ where: { id: 1 }, update: req.body, create: { id: 1, ...req.body } }));
