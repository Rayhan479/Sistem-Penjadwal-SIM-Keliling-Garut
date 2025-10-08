import { PrismaClient } from '../lib/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const users = [
    {
      username: 'superadmin',
      email: 'superadmin@simkeliling.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true
    },
    {
      username: 'admin1',
      email: 'admin1@simkeliling.com',
      password: hashedPassword,
      name: 'Admin Satu',
      role: 'admin',
      isActive: true
    },
    {
      username: 'admin2',
      email: 'admin2@simkeliling.com',
      password: hashedPassword,
      name: 'Admin Dua',
      role: 'admin',
      isActive: true
    }
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }

  console.log('✅ Users seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
