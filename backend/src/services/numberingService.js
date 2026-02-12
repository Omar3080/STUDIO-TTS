import { prisma } from '../config/prisma.js';

export async function nextNumber(key) {
  const seq = await prisma.numberingSequence.update({
    where: { key },
    data: { current: { increment: 1 } }
  });
  return `${seq.prefix}-${String(seq.current).padStart(6, '0')}`;
}
