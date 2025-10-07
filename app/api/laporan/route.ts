import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

async function checkAndUpdateJadwalStatus(tanggal: Date, lokasi: string) {
  const jadwal = await prisma.jadwal.findFirst({
    where: {
      tanggal: tanggal,
      lokasi: lokasi
    }
  });

  if (jadwal) {
    const totalDilayani = await prisma.laporan.aggregate({
      where: {
        tanggal: tanggal,
        lokasi: lokasi,
        status: 'selesai'
      },
      _sum: {
        jumlah: true
      }
    });

    const total = totalDilayani._sum.jumlah || 0;
    
    if (total >= jadwal.jumlahKuota && jadwal.status !== 'selesai') {
      await prisma.jadwal.update({
        where: { id: jadwal.id },
        data: { status: 'selesai' }
      });
    }
  }
}

export async function GET() {
  try {
    const laporan = await prisma.laporan.findMany({
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json(laporan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch laporan' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggal, lokasi, jumlah, status } = body;

    const tanggalDate = new Date(tanggal);

    const laporan = await prisma.laporan.upsert({
      where: {
        tanggal_lokasi: {
          tanggal: tanggalDate,
          lokasi
        }
      },
      update: {
        jumlah: { increment: parseInt(jumlah) },
        status
      },
      create: {
        tanggal: tanggalDate,
        lokasi,
        jumlah: parseInt(jumlah),
        status
      }
    });

    await checkAndUpdateJadwalStatus(tanggalDate, lokasi);

    return NextResponse.json(laporan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create laporan' }, { status: 500 });
  }
}