import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Fetch all jadwal
export async function GET() {
  try {
    // Auto-update status before fetching
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const currentTime = now.toTimeString().slice(0, 5);

    await prisma.jadwal.updateMany({
      where: {
        tanggal: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        },
        waktuMulai: { lte: currentTime },
        waktuSelesai: { gte: currentTime },
        status: 'terjadwal'
      },
      data: { status: 'berlangsung' }
    });

    await prisma.jadwal.updateMany({
      where: {
        OR: [
          {
            tanggal: { lt: today },
            status: { in: ['terjadwal', 'berlangsung'] }
          },
          {
            tanggal: {
              gte: today,
              lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            },
            waktuSelesai: { lt: currentTime },
            status: { in: ['terjadwal', 'berlangsung'] }
          }
        ]
      },
      data: { status: 'selesai' }
    });

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
    const { judul, tanggal, lokasi, alamatLengkap, latitude, longitude, gambar, waktuMulai, waktuSelesai, jumlahKuota, status } = body;

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
        jumlahKuota: jumlahKuota ? parseInt(jumlahKuota) : 100,
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