import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('Fetching contact info...');
    const contact = await prisma.$queryRaw`SELECT * FROM "ContactInfo" LIMIT 1`;
    console.log('Contact found:', contact);
    return NextResponse.json(contact[0] || null);
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'Failed to fetch contact info', details: error }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phone, email, whatsapp, address } = await request.json();
    
    // Try to update first
    const updated = await prisma.$executeRaw`
      UPDATE "ContactInfo" 
      SET phone = ${phone}, email = ${email}, whatsapp = ${whatsapp}, address = ${address}, "updatedAt" = NOW()
      WHERE id = 1
    `;
    
    if (updated === 0) {
      // If no rows updated, insert new record
      await prisma.$executeRaw`
        INSERT INTO "ContactInfo" (phone, email, whatsapp, address, "createdAt", "updatedAt")
        VALUES (${phone}, ${email}, ${whatsapp}, ${address}, NOW(), NOW())
      `;
    }
    
    // Fetch the updated/created record
    const contact = await prisma.$queryRaw`SELECT * FROM "ContactInfo" WHERE id = 1`;
    
    return NextResponse.json(contact[0]);
  } catch (error) {
    console.error('Contact update error:', error);
    return NextResponse.json({ error: 'Failed to update contact info', details: error }, { status: 500 });
  }
}