import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { tanggal, lokasi, jumlah, status } = body;

    const laporan = await prisma.laporan.update({
      where: { id: parseInt(params.id) },
      data: {
        tanggal: new Date(tanggal),
        lokasi,
        jumlah: parseInt(jumlah),
        status
      }
    });

    return NextResponse.json(laporan);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update laporan' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.laporan.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Laporan deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete laporan' }, { status: 500 });
  }
}