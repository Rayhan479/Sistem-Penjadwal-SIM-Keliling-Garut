import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

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

    const laporan = await prisma.laporan.create({
      data: {
        tanggal: new Date(tanggal),
        lokasi,
        jumlah: parseInt(jumlah),
        status
      }
    });

    return NextResponse.json(laporan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create laporan' }, { status: 500 });
  }
}