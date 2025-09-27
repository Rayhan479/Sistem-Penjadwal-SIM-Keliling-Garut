import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MessageCircle } from "lucide-react";
import "@/app/globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIM Keliling Garut - Layanan Perpanjangan SIM",
  description: "Sistem Informasi Jadwal SIM Keliling Kabupaten Garut. Temukan jadwal dan lokasi layanan SIM Keliling dengan mudah dan praktis.",
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />

        {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-colors">
          <MessageCircle size={24} />
        </button>
      </div>
      </body>
    </html>
  );
}