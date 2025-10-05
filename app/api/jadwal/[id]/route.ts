import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Fetch single jadwal by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const jadwal = await prisma.jadwal.findUnique({
      where: { id }
    });

    if (!jadwal) {
      return NextResponse.json(
        { error: 'Jadwal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(jadwal);
  } catch (error) {
    console.error('Error fetching jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jadwal' },
      { status: 500 }
    );
  }
}

// PUT - Update jadwal by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { judul, tanggal, lokasi, alamatLengkap, latitude, longitude, gambar, waktuMulai, waktuSelesai, jumlahKuota, status } = body;

    const jadwal = await prisma.jadwal.update({
      where: { id },
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
        status
      }
    });

    return NextResponse.json(jadwal);
  } catch (error) {
    console.error('Error updating jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to update jadwal' },
      { status: 500 }
    );
  }
}

// DELETE - Delete jadwal by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    await prisma.jadwal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Jadwal deleted successfully' });
  } catch (error) {
    console.error('Error deleting jadwal:', error);
    return NextResponse.json(
      { error: 'Failed to delete jadwal' },
      { status: 500 }
    );
  }
}