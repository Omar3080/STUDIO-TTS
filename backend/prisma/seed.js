import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Administrator' }
  });

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', fullName: 'مدير النظام', passwordHash }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id }
  });

  const unitPiece = await prisma.unit.upsert({ where: { name: 'قطعة' }, update: {}, create: { name: 'قطعة' } });
  const category = await prisma.category.upsert({ where: { name: 'عام' }, update: {}, create: { name: 'عام' } });

  await prisma.customer.upsert({
    where: { code: 'CUST-001' },
    update: {},
    create: { code: 'CUST-001', name: 'شركة النور', phone: '01000000000', address: 'القاهرة' }
  });

  await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: {
      sku: 'SKU-001',
      barcode: '622100000001',
      name: 'منتج تجريبي',
      unitId: unitPiece.id,
      categoryId: category.id,
      salePrice: 150,
      purchasePrice: 100,
      quantityOnHand: 100,
      reorderLevel: 10
    }
  });

  await prisma.setting.upsert({ where: { id: 'default-settings' }, update: {}, create: { id: 'default-settings' } });

  const sequences = [
    { key: 'invoice', prefix: 'INV', current: 0 },
    { key: 'return', prefix: 'RET', current: 0 },
    { key: 'payment', prefix: 'PAY', current: 0 }
  ];
  for (const seq of sequences) {
    await prisma.numberingSequence.upsert({ where: { key: seq.key }, update: {}, create: seq });
  }
}

main().finally(() => prisma.$disconnect());
