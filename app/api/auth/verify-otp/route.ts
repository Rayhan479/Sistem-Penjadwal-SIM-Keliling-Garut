import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/index.js';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    const passwordReset = await prisma.passwordReset.findFirst({
      where: {
        email,
        otp,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!passwordReset) {
      return NextResponse.json({ error: 'Kode OTP tidak valid atau sudah kadaluarsa' }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Kode OTP valid',
      verified: true 
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Gagal memverifikasi OTP' }, { status: 500 });
  }
}
