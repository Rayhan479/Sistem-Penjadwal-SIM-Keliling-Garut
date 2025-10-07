import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const jadwal = await prisma.jadwal.findMany({
      orderBy: { tanggal: 'asc' }
    });

    const jadwalWithQuota = await Promise.all(
      jadwal.map(async (item) => {
        const totalDilayani = await prisma.laporan.aggregate({
          where: {
            tanggal: item.tanggal,
            lokasi: item.lokasi,
            status: 'selesai'
          },
          _sum: {
            jumlah: true
          }
        });

        const sisaKuota = item.jumlahKuota - (totalDilayani._sum.jumlah || 0);

        return {
          ...item,
          sisaKuota: sisaKuota > 0 ? sisaKuota : 0
        };
      })
    );

    return NextResponse.json(jadwalWithQuota);
  } catch (error) {
    console.error('Error fetching jadwal with quota:', error);
    return NextResponse.json({ error: 'Failed to fetch jadwal' }, { status: 500 });
  }
}
