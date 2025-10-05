import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Fetch fees
export async function GET() {
  try {
    const fees = await (prisma as any).fees.findFirst();
    
    if (!fees) {
      // Return default fees if none exist
      return NextResponse.json({
        simA: 120000,
        simB1: 250000,
        simB2: 250000,
        simC: 200000
      });
    }
    
    return NextResponse.json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fees' },
      { status: 500 }
    );
  }
}

// PUT - Update fees
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { simA, simB1, simB2, simC } = body;

    const fees = await (prisma as any).fees.upsert({
      where: { id: 1 },
      update: {
        simA: parseInt(simA),
        simB1: parseInt(simB1),
        simB2: parseInt(simB2),
        simC: parseInt(simC)
      },
      create: {
        id: 1,
        simA: parseInt(simA),
        simB1: parseInt(simB1),
        simB2: parseInt(simB2),
        simC: parseInt(simC)
      }
    });

    return NextResponse.json(fees);
  } catch (error) {
    console.error('Error updating fees:', error);
    return NextResponse.json(
      { error: 'Failed to update fees' },
      { status: 500 }
    );
  }
}