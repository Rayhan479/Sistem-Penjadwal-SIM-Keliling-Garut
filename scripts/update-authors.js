const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updatePengumumanAuthors() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      console.error('No admin user found.');
      return;
    }

    const result = await prisma.pengumuman.updateMany({
      where: { authorId: null },
      data: { authorId: adminUser.id }
    });

    console.log(`✅ Updated ${result.count} pengumuman records with authorId: ${adminUser.id} (${adminUser.name})`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePengumumanAuthors();