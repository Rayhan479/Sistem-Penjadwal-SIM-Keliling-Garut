import { PrismaClient } from '../lib/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create Super Admin
  await prisma.user.upsert({
    where: { username: 'superadmin' },
    update: {},
    create: {
      username: 'superadmin',
      email: 'superadmin@simkeliling.com',
      password: hashedPassword,
      name: 'Super Administrator',
      role: 'super_admin',
      isActive: true
    }
  });

  // Create Admin
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@simkeliling.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'admin',
      isActive: true
    }
  });

  console.log('Users created:');
  console.log('Super Admin - username: superadmin, password: admin123');
  console.log('Admin - username: admin, password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
