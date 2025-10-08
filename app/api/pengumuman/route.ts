import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pengumuman = await prisma.pengumuman.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: { tanggal: 'desc' }
    });
    const pengumumanWithAuthor = pengumuman.map(item => ({
      ...item,
      author: item.author?.name || 'Admin SIM Keliling'
    }));
    return NextResponse.json(pengumumanWithAuthor);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pengumuman' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, tanggal, isi, gambar, category, authorId } = body;

    const pengumuman = await prisma.pengumuman.create({
      data: {
        judul,
        tanggal: new Date(tanggal),
        isi,
        gambar: gambar || null,
        category: category || 'Pengumuman',
        authorId: authorId || null,
        createdAt: new Date(),
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

    return NextResponse.json(pengumuman, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create pengumuman' }, { status: 500 });
  }
}