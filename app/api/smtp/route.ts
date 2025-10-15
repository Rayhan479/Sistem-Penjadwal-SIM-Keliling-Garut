import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    let smtp = await prisma.smtpSettings.findUnique({ where: { id: 1 } });
    
    if (!smtp) {
      smtp = await prisma.smtpSettings.create({
        data: {
          id: 1,
          host: process.env.EMAIL_HOST || "smtp.gmail.com",
          port: parseInt(process.env.EMAIL_PORT || "587"),
          username: process.env.EMAIL_USER || "",
          password: process.env.EMAIL_PASSWORD || "",
          secure: false,
        },
      });
    }

    return NextResponse.json({
      ...smtp,
      password: smtp.password ? "********" : "",
    });
  } catch (error) {
    console.error("Error fetching SMTP settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch SMTP settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { host, port, username, password, secure } = body;

    const updateData: any = {
      host,
      port: parseInt(port),
      username,
      secure,
    };

    if (password && password !== "********") {
      updateData.password = password;
    }

    const smtp = await prisma.smtpSettings.upsert({
      where: { id: 1 },
      update: updateData,
      create: {
        id: 1,
        host,
        port: parseInt(port),
        username,
        password: password || "",
        secure,
      },
    });

    return NextResponse.json({
      ...smtp,
      password: smtp.password ? "********" : "",
    });
  } catch (error) {
    console.error("Error updating SMTP settings:", error);
    return NextResponse.json(
      { error: "Failed to update SMTP settings" },
      { status: 500 }
    );
  }
}
