import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Fetch all jadwal
export async function GET() {
  try {
    const jadwal = await prisma.jadwal.findMany({
      orderBy: {
        tanggal: 'asc'
      }
    });
    return NextResponse.json(jadwal);
  } catch (error) {
    console.error('Error fetching jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jadwal' },
      { status: 500 }
    );
  }
}

// POST - Create new jadwal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { judul, tanggal, lokasi, alamatLengkap, latitude, longitude, gambar, waktuMulai, waktuSelesai, status } = body;

    const jadwal = await prisma.jadwal.create({
      data: {
        judul,
        tanggal: new Date(tanggal),
        lokasi,
        alamatLengkap,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        gambar,
        waktuMulai,
        waktuSelesai,
        status: status || 'terjadwal'
      }
    });

    return NextResponse.json(jadwal, { status: 201 });
  } catch (error) {
    console.error('Error creating jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to create jadwal' },
      { status: 500 }
    );
  }
}