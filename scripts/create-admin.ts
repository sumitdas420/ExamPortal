// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2'; // Changed from bcrypt

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@example.com';
  const username = 'admin';
  const plainPassword = 'admin123';

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`❌ Admin with email ${email} already exists`);
    console.log(`💡 Use: curl -X POST http://localhost:3000/api/reset-admin to reset`);
    return;
  }

  // Use Argon2 instead of bcrypt
  const hashed = await argon2.hash(plainPassword);

  const admin = await prisma.admin.create({
    data: {
      username,
      email,
      password: hashed,
      role: 'SUPER_ADMIN', // Fixed role name
    },
  });

  console.log(`✅ Super Admin created: ${admin.email}`);
  console.log(`📧 Email: ${admin.email}`);
  console.log(`🔑 Password: ${plainPassword}`);
  console.log(`👤 Username: ${admin.username}`);
  console.log(`🔐 Role: ${admin.role}`);
}

main()
  .catch(e => {
    console.error('❌ Error creating admin:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
