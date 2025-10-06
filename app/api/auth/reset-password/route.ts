import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    await prisma.passwordReset.update({
      where: { id: passwordReset.id },
      data: { used: true }
    });

    return NextResponse.json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Gagal mereset password' }, { status: 500 });
  }
}
