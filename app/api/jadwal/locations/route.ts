import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const locations = await prisma.jadwal.findMany({
      select: {
        lokasi: true
      },
      distinct: ['lokasi'],
      orderBy: {
        lokasi: 'asc'
      }
    });

    const locationNames = locations.map(item => item.lokasi);
    return NextResponse.json(locationNames);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}