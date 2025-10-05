import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      select: {
        id: true,
        judul: true,
        isi: true,
        tanggal: true,
        gambar: true,
        category: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { tanggal: 'desc' }
    });
    return NextResponse.json(pengumuman);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pengumuman' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, tanggal, isi, gambar, category } = body;

    const pengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        tanggal: new Date(tanggal),
        isi,
        gambar: gambar || null,
        category: category || 'Pengumuman',
        createdAt: new Date(),
        updatedAt: new Date()
      } 
    });

    return NextResponse.json(pengumuman, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pengumuman' }, { status: 500 });
  }
}