import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { judul, tanggal, isi, gambar, category, authorId } = body;

    const pengumuman = await prisma.pengumuman.update({
      where: { id: parseInt(id) },
      data: {
        judul,
        tanggal: new Date(tanggal),
        isi,
        gambar: gambar || null,
        category: category || 'Pengumuman',
        authorId: authorId || null,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(pengumuman);
  } catch {
    return NextResponse.json({ error: 'Failed to update pengumuman' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.pengumuman.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'Pengumuman deleted successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete pengumuman' }, { status: 500 });
  }
}