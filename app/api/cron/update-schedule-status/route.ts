import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = now.toTimeString().slice(0, 5);

    await prisma.jadwal.updateMany({
      where: {
        tanggal: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        waktuMulai: { lte: currentTime },
        waktuSelesai: { gte: currentTime },
        status: 'terjadwal'
      },
      data: { status: 'berlangsung' }
    });

    await prisma.jadwal.updateMany({
      where: {
        OR: [
          {
            tanggal: { lt: today },
            status: { in: ['terjadwal', 'berlangsung'] }
          },
          {
            tanggal: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            waktuSelesai: { lt: currentTime },
            status: { in: ['terjadwal', 'berlangsung'] }
          }
        ]
      },
      data: { status: 'selesai' }
    });

    return NextResponse.json({ message: 'Status updated', timestamp: now.toISOString() });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
