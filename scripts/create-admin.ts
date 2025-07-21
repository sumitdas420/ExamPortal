// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const plainPassword = 'admin@123';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`❌ Admin with email ${email} already exists`);
    return;
  }

  const hashed = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashed,
      role: 'super_admin', // ✅ Give this admin super admin rights
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}`);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
