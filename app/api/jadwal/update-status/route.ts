import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = now.toTimeString().slice(0, 5);

    // Update to "berlangsung" - jadwal hari ini yang waktu mulai sudah lewat tapi belum selesai
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

    // Update to "selesai" - jadwal yang waktu selesai sudah lewat
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

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
