import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const { question, answer, category } = await request.json();
    const id = parseInt(paramId);
    
    const faq = await prisma.faq.update({
      where: { id },
      data: { question, answer, category: category || 'Umum' }
    });
    
    return NextResponse.json(faq);
  } catch  {
    return NextResponse.json({ error: 'Failed to update FAQ' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: paramId } = await params;
    const id = parseInt(paramId);
    
    await prisma.faq.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch  {
    return NextResponse.json({ error: 'Failed to delete FAQ' }, { status: 500 });
  }
}