import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const upcomingJadwal = await prisma.jadwal.findMany({
      where: {
        tanggal: {
          gte: tomorrow
        },
        status: {
          not: 'selesai'
        }
      },
      orderBy: {
        tanggal: 'asc'
      },
      take: 9
    });

    return NextResponse.json(upcomingJadwal);
  } catch (error) {
    console.error('Error fetching upcoming jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming jadwal' },
      { status: 500 }
    );
  }
}