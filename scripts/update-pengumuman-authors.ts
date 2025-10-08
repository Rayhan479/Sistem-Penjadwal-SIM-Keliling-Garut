import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePengumumanAuthors() {
  try {
    // Get the first admin user (superadmin)
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.error('No admin user found. Please run seed-users.ts first.');
      return;
    }

    // Update all pengumuman with null authorId
    const result = await prisma.pengumuman.updateMany({
      where: { authorId: null },
      data: { authorId: adminUser.id }
    });

    console.log(`✅ Updated ${result.count} pengumuman records with authorId: ${adminUser.id} (${adminUser.name})`);
  } catch (error) {
    console.error('Error updating pengumuman:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePengumumanAuthors();
