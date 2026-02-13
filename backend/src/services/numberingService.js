import { prisma } from '../config/prisma.js';

export async function nextNumber(tx, key) {
  const sequence = await tx.numberingSequence.update({ where: { key }, data: { current: { increment: 1 } } });
  return `${sequence.prefix}-${String(sequence.current).padStart(6, '0')}`;
}

export { prisma };
