import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { judul, tanggal, isi, gambar } = body;

    const pengumuman = await prisma.pengumuman.update({
      where: { id: parseInt(params.id) },
      data: {
        judul,
        tanggal: new Date(tanggal),
        isi,
        gambar: gambar || null
      }
    });

    return NextResponse.json(pengumuman);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update pengumuman' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.pengumuman.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({ message: 'Pengumuman deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete pengumuman' }, { status: 500 });
  }
}