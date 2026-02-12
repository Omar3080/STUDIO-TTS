import { prisma } from '../config/prisma.js';

export async function audit(userId, action, entity, entityId, payload) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, payload: payload ? JSON.stringify(payload) : null }
  });
}
