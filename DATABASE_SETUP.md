# Setup Database Prisma PostgreSQL

## 📋 Panduan Lengkap Setup Database

### 1. **Koneksi Database PostgreSQL**

#### **Opsi A: Menggunakan Prisma Postgres (Cloud)**

1. **Buat Akun Prisma:**
   - Buka [https://console.prisma.io](https://console.prisma.io)
   - Sign up atau login dengan GitHub/Google

2. **Buat Project Baru:**
   - Klik "New Project"
   - Pilih "Prisma Postgres"
   - Pilih region terdekat (Singapore/Asia)
   - Tunggu database dibuat

3. **Copy Connection String:**
   - Setelah database dibuat, copy 2 connection strings:
     - `DATABASE_URL` (Direct connection)
     - `PRISMA_DATABASE_URL` (Accelerate connection)

4. **Update File `.env`:**

```env
# Prisma Postgres Connection
POSTGRES_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
DATABASE_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
```

---

#### **Opsi B: Menggunakan PostgreSQL Lokal**

1. **Install PostgreSQL:**
   - Download dari [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   - Install dengan default settings
   - Catat password yang Anda buat

2. **Buat Database:**
   ```bash
   # Buka psql atau pgAdmin
   CREATE DATABASE sim_keliling_garut;
   ```

3. **Update File `.env`:**

```env
# Local PostgreSQL Connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sim_keliling_garut"
```

---

#### **Opsi C: Menggunakan Supabase (Free)**

1. **Buat Akun Supabase:**
   - Buka [https://supabase.com](https://supabase.com)
   - Sign up gratis

2. **Buat Project Baru:**
   - Klik "New Project"
   - Isi nama project dan password database
   - Pilih region terdekat

3. **Copy Connection String:**
   - Buka "Settings" → "Database"
   - Copy "Connection string" → "URI"
   - Ganti `[YOUR-PASSWORD]` dengan password database Anda

4. **Update File `.env`:**

```env
# Supabase Connection
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

---

### 2. **Push Schema ke Database**

Setelah koneksi database dikonfigurasi:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Push schema ke database (tanpa migrasi)
npx prisma db push

# 3. Atau buat migrasi (recommended untuk production)
npx prisma migrate dev --name init
```

**Output yang diharapkan:**
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

---

### 3. **Membuat Admin User**

#### **Cara 1: Menggunakan Script (Recommended)**

1. **Jalankan script create-admin:**

```bash
# Windows
npx tsx scripts/create-admin.ts

# Linux/Mac
npx tsx scripts/create-admin.ts
```

2. **Output yang diharapkan:**

```
Users created:
Super Admin - username: superadmin, password: admin123
Admin - username: admin, password: admin123
```

3. **Login Credentials:**

```
Super Admin:
- Username: superadmin
- Email: superadmin@simkeliling.com
- Password: admin123

Admin:
- Username: admin
- Email: admin@simkeliling.com
- Password: admin123
```

---

#### **Cara 2: Menggunakan Prisma Studio (Manual)**

1. **Buka Prisma Studio:**

```bash
npx prisma studio
```

2. **Buka browser:** `http://localhost:5555`

3. **Buat User Baru:**
   - Klik model "User"
   - Klik "Add record"
   - Isi data:
     - username: `superadmin`
     - email: `superadmin@simkeliling.com`
     - password: (hash dari `admin123`)
     - name: `Super Administrator`
     - role: `super_admin`
     - isActive: `true`
   - Klik "Save 1 change"

**Note:** Password harus di-hash dengan bcrypt. Gunakan script untuk kemudahan.

---

### 4. **Verifikasi Database**

#### **Cek Tabel yang Dibuat:**

```bash
npx prisma studio
```

Tabel yang harus ada:
- ✅ `users` - Data admin dan user
- ✅ `jadwal` - Jadwal SIM Keliling
- ✅ `sim_categories` - Kategori dan biaya SIM
- ✅ `Faq` - Frequently Asked Questions
- ✅ `ContactInfo` - Informasi kontak
- ✅ `Pengumuman` - Pengumuman
- ✅ `Laporan` - Laporan kegiatan
- ✅ `password_resets` - OTP reset password
- ✅ `smtp_settings` - Konfigurasi SMTP

---

### 5. **Seed Data (Optional)**

Untuk mengisi data awal:

```bash
# Jalankan script create-admin
npx tsx scripts/create-admin.ts

# Data yang dibuat:
# - 2 User (superadmin & admin)
# - Password default: admin123
```

---

## 🔧 Troubleshooting

### **Error: Can't reach database server**

**Solusi:**
1. Cek koneksi internet
2. Pastikan `DATABASE_URL` di `.env` benar
3. Cek firewall tidak block port 5432
4. Restart database server (jika lokal)

---

### **Error: P1001 - Can't reach database**

**Solusi:**
```bash
# Test koneksi
npx prisma db pull

# Jika gagal, cek DATABASE_URL di .env
```

---

### **Error: P3009 - Failed to create database**

**Solusi:**
```bash
# Gunakan db push instead of migrate
npx prisma db push
```

---

### **Error: Module not found 'bcryptjs'**

**Solusi:**
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

---

### **Error: Cannot find module 'tsx'**

**Solusi:**
```bash
npm install -D tsx
```

---

## 📝 File Konfigurasi

### **File `.env` Lengkap:**

```env
# Database Connection
POSTGRES_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"
PRISMA_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_API_KEY"
DATABASE_URL="postgres://user:password@db.prisma.io:5432/postgres?sslmode=require"

# JWT Secret
JWT_SECRET="sim-keliling-garut-secret-key-2024-change-this-in-production"

# Email Configuration (Optional - untuk forgot password)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="SIM Keliling Garut <noreply@simkeliling.com>"
```

---

## 🚀 Quick Start

**Setup lengkap dalam 5 langkah:**

```bash
# 1. Install dependencies
npm install

# 2. Setup database connection di .env
# Edit file .env dengan DATABASE_URL Anda

# 3. Generate Prisma Client
npx prisma generate

# 4. Push schema ke database
npx prisma db push

# 5. Buat admin user
npx tsx scripts/create-admin.ts

# 6. Jalankan aplikasi
npm run dev
```

---

## 📊 Database Schema Overview

```
┌─────────────────┐
│     users       │ → Admin & Super Admin
├─────────────────┤
│ id              │
│ username        │
│ email           │
│ password        │
│ name            │
│ role            │
│ isActive        │
└─────────────────┘

┌─────────────────┐
│     jadwal      │ → Jadwal SIM Keliling
├─────────────────┤
│ id              │
│ judul           │
│ tanggal         │
│ lokasi          │
│ waktuMulai      │
│ waktuSelesai    │
│ status          │
└─────────────────┘

┌─────────────────┐
│ sim_categories  │ → Kategori & Biaya SIM
├─────────────────┤
│ id              │
│ code            │
│ name            │
│ description     │
│ price           │
│ isDefault       │
└─────────────────┘

┌─────────────────┐
│ smtp_settings   │ → Konfigurasi Email
├─────────────────┤
│ id              │
│ host            │
│ port            │
│ username        │
│ password        │
│ secure          │
└─────────────────┘
```

---

## 🎯 Next Steps

Setelah database setup:

1. ✅ Login ke admin panel: `/login`
2. ✅ Gunakan credentials: `superadmin` / `admin123`
3. ✅ Ubah password default di menu Pengaturan
4. ✅ Setup SMTP settings untuk email OTP
5. ✅ Tambah kategori SIM jika perlu
6. ✅ Mulai input jadwal SIM Keliling

---

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Postgres](https://www.prisma.io/postgres)

---

## ⚠️ Important Notes

### **Untuk Production:**

1. **Ganti JWT_SECRET:**
   ```env
   JWT_SECRET="your-very-secure-random-string-here"
   ```

2. **Ganti Password Default:**
   - Login sebagai superadmin
   - Buka menu Pengaturan
   - Ubah password

3. **Backup Database:**
   ```bash
   # Export database
   pg_dump -U postgres sim_keliling_garut > backup.sql
   
   # Import database
   psql -U postgres sim_keliling_garut < backup.sql
   ```

4. **Enable SSL:**
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```

---

## 🔐 Security Checklist

- ✅ Ganti JWT_SECRET di production
- ✅ Ganti password default admin
- ✅ Gunakan SSL untuk database connection
- ✅ Jangan commit file `.env` ke git
- ✅ Backup database secara berkala
- ✅ Monitor database logs
- ✅ Batasi akses database hanya dari IP tertentu

---

**Selamat! Database Anda sudah siap digunakan! 🎉**
