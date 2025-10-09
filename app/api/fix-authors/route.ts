import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'No admin user found' }, { status: 404 });
    }

    const result = await prisma.pengumuman.updateMany({
      where: { authorId: null },
      data: { authorId: adminUser.id }
    });

    return NextResponse.json({ 
      message: `Updated ${result.count} pengumuman records`,
      authorId: adminUser.id,
      authorName: adminUser.name
    });
  } catch  {
    return NextResponse.json({ error: 'Failed to update authors' }, { status: 500 });
  }
}