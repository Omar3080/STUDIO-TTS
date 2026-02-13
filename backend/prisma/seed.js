import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const adminRole = await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin', description: 'System Administrator' } });
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', fullName: 'مدير النظام', passwordHash }
  });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: user.id, roleId: adminRole.id } }, update: {}, create: { userId: user.id, roleId: adminRole.id } });

  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, companyName: 'شركة المبيعات الحديثة', invoicePrefix: 'INV' } });

  await prisma.numberingSequence.upsert({ where: { key: 'invoice' }, update: {}, create: { key: 'invoice', prefix: 'INV', current: 1000 } });
  await prisma.numberingSequence.upsert({ where: { key: 'return' }, update: {}, create: { key: 'return', prefix: 'RET', current: 1000 } });
  await prisma.numberingSequence.upsert({ where: { key: 'payment' }, update: {}, create: { key: 'payment', prefix: 'PAY', current: 1000 } });

  const unit = await prisma.unit.upsert({ where: { name: 'قطعة' }, update: {}, create: { name: 'قطعة' } });
  const category = await prisma.category.upsert({ where: { name: 'عام' }, update: {}, create: { name: 'عام' } });

  await prisma.customer.upsert({ where: { code: 'CUST-001' }, update: {}, create: { code: 'CUST-001', name: 'عميل تجريبي', phone: '01000000000', creditLimit: 5000 } });
  await prisma.product.upsert({
    where: { sku: 'SKU-001' },
    update: {},
    create: { sku: 'SKU-001', barcode: '10000001', name: 'صنف تجريبي', sellingPrice: 150, purchasePrice: 100, quantityOnHand: 100, reorderLevel: 10, unitId: unit.id, categoryId: category.id }
  });
}

main().finally(async () => prisma.$disconnect());
