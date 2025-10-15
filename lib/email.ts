import nodemailer from 'nodemailer';
import { PrismaClient } from '@/lib/generated/prisma/index.js';

const prisma = new PrismaClient();

async function getTransporter() {
  const smtp = await prisma.smtpSettings.findUnique({ where: { id: 1 } });
  
  if (!smtp) {
    throw new Error('SMTP settings not configured');
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });
}

export async function sendOTPEmail(email: string, otp: string, name: string) {
  const transporter = await getTransporter();
  const smtp = await prisma.smtpSettings.findUnique({ where: { id: 1 } });
  
  const mailOptions = {
    from: `SIM Keliling Garut <${smtp?.username}>`,
    to: email,
    subject: 'Kode OTP Reset Password - SIM Keliling Garut',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Password</h2>
        <p>Halo <strong>${name}</strong>,</p>
        <p>Anda telah meminta untuk mereset password akun Anda. Gunakan kode OTP berikut:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
        </div>
        <p>Kode OTP ini berlaku selama <strong>10 menit</strong>.</p>
        <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Email ini dikirim secara otomatis oleh sistem SIM Keliling Kabupaten Garut.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
