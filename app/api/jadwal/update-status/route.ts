import { NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const now = new Date();
    
    const schedules = await prisma.jadwal.findMany({
      where: {
        status: {
          not: 'dibatalkan'
        }
      }
    });

    const updates = [];
    const laporanToCreate = [];

    for (const schedule of schedules) {
      const scheduleDate = new Date(schedule.tanggal);
      const [startHour, startMinute] = schedule.waktuMulai.split(':').map(Number);
      const [endHour, endMinute] = schedule.waktuSelesai.split(':').map(Number);
      
      const startTime = new Date(scheduleDate);
      startTime.setHours(startHour, startMinute, 0, 0);
      
      const endTime = new Date(scheduleDate);
      endTime.setHours(endHour, endMinute, 0, 0);

      let newStatus = schedule.status;
      
      // Skip if already selesai (could be from quota check)
      if (schedule.status === 'selesai') {
        continue;
      }
      
      if (now < startTime) {
        newStatus = 'terjadwal';
      } else if (now >= startTime && now <= endTime) {
        newStatus = 'berlangsung';
      } else if (now > endTime) {
        newStatus = 'selesai';
        
        laporanToCreate.push({
          tanggal: schedule.tanggal,
          lokasi: schedule.lokasi,
          jumlah: 0,
          status: 'selesai'
        });
      }

      if (newStatus !== schedule.status) {
        updates.push(
          prisma.jadwal.update({
            where: { id: schedule.id },
            data: { status: newStatus }
          })
        );
      }
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    if (laporanToCreate.length > 0) {
      await prisma.laporan.createMany({
        data: laporanToCreate,
        skipDuplicates: true
      });
    }

    return NextResponse.json({ 
      message: 'Status updated successfully',
      updatedCount: updates.length,
      laporanCreated: laporanToCreate.length
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}