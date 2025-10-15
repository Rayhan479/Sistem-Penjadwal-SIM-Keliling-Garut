import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.simCategory.findMany({
      orderBy: { code: 'asc' }
    });

    if (categories.length === 0) {
      const defaultCategories = [
        { code: 'A', name: 'SIM A', description: 'Kendaraan bermotor roda empat (mobil)', price: 120000, isDefault: true },
        { code: 'B1', name: 'SIM B1', description: 'Kendaraan bermotor roda dua (motor) di atas 250cc', price: 250000, isDefault: true },
        { code: 'B2', name: 'SIM B2', description: 'Kendaraan bermotor roda dua (motor) di bawah 250cc', price: 250000, isDefault: true },
        { code: 'C', name: 'SIM C', description: 'Kendaraan bermotor umum', price: 200000, isDefault: true },
      ];

      await prisma.simCategory.createMany({ data: defaultCategories });
      return NextResponse.json(await prisma.simCategory.findMany({ orderBy: { code: 'asc' } }));
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching SIM categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, description, price } = body;

    const category = await prisma.simCategory.create({
      data: { code, name, description, price: parseInt(price), isDefault: false }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error creating SIM category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
