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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tanggal, lokasi, jumlah, status } = body;

    const laporan = await prisma.laporan.update({
      where: { id: parseInt(id) },
      data: {
        tanggal: new Date(tanggal),
        lokasi,
        jumlah: parseInt(jumlah),
        status
      }
    });

    await checkAndUpdateJadwalStatus(new Date(tanggal), lokasi);

    return NextResponse.json(laporan);
  } catch {
    return NextResponse.json({ error: 'Failed to update laporan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const laporan = await prisma.laporan.findUnique({
      where: { id: parseInt(id) }
    });

    await prisma.laporan.delete({
      where: { id: parseInt(id) }
    });

    if (laporan) {
      await checkAndUpdateJadwalStatus(laporan.tanggal, laporan.lokasi);
    }

    return NextResponse.json({ message: 'Laporan deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete laporan' }, { status: 500 });
  }
}