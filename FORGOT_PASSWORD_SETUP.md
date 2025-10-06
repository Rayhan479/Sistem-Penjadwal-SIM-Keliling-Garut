# Setup Fitur Lupa Password dengan OTP Email

## 📋 Fitur yang Ditambahkan

### 1. **Forgot Password Flow**
- ✅ Request OTP via Email
- ✅ Verifikasi OTP (6 digit)
- ✅ Reset Password Baru
- ✅ Success Confirmation

### 2. **Keamanan**
- OTP berlaku 10 menit
- OTP hanya bisa digunakan sekali
- Password di-hash dengan bcrypt
- Validasi email terdaftar

---

## 🗄️ Database Schema

Model `PasswordReset` telah ditambahkan:

```prisma
model PasswordReset {
  id        Int      @id @default(autoincrement())
  email     String
  otp       String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@map("password_resets")
}
```

---

## 📧 Konfigurasi Email

### Setup Gmail SMTP

1. **Buka file `.env`** dan update konfigurasi email:

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_FROM="SIM Keliling Garut <noreply@simkeliling.com>"
```

2. **Cara Mendapatkan App Password Gmail:**

   a. Buka [Google Account Security](https://myaccount.google.com/security)
   
   b. Aktifkan **2-Step Verification**
   
   c. Buka **App passwords**: https://myaccount.google.com/apppasswords
   
   d. Pilih:
      - App: **Mail**
      - Device: **Other (Custom name)** → ketik "SIM Keliling"
   
   e. Klik **Generate**
   
   f. Copy 16-digit password yang muncul
   
   g. Paste ke `EMAIL_PASSWORD` di file `.env`

3. **Contoh Konfigurasi:**

```env
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="simkeliling.garut@gmail.com"
EMAIL_PASSWORD="abcd efgh ijkl mnop"
EMAIL_FROM="SIM Keliling Garut <noreply@simkeliling.com>"
```

---

## 🚀 Cara Menggunakan

### **User Flow:**

1. **Buka halaman Login** → `/login`

2. **Klik "Lupa Password?"**

3. **Step 1: Masukkan Email**
   - Input email yang terdaftar
   - Klik "Kirim Kode OTP"
   - OTP akan dikirim ke email

4. **Step 2: Verifikasi OTP**
   - Cek email untuk kode OTP 6 digit
   - Masukkan kode OTP
   - Klik "Verifikasi OTP"
   - Jika salah, bisa klik "Kirim ulang kode OTP"

5. **Step 3: Password Baru**
   - Masukkan password baru (min 6 karakter)
   - Konfirmasi password baru
   - Klik "Reset Password"

6. **Step 4: Success**
   - Password berhasil direset
   - Klik "Login Sekarang"

---

## 📁 File yang Dibuat/Dimodifikasi

### **Backend (API):**
1. `lib/email.ts` - Utility untuk kirim email & generate OTP
2. `app/api/auth/forgot-password/route.ts` - Request OTP
3. `app/api/auth/verify-otp/route.ts` - Verifikasi OTP
4. `app/api/auth/reset-password/route.ts` - Reset password

### **Frontend:**
1. `app/forgot-password/page.tsx` - Halaman forgot password
2. `app/login/page.tsx` - Tambah link "Lupa Password"

### **Database:**
1. `prisma/schema.prisma` - Model PasswordReset
2. `.env` - Konfigurasi email

---

## 🧪 Testing

### **Test dengan Email Asli:**

1. Update `.env` dengan Gmail credentials Anda
2. Restart development server: `npm run dev`
3. Buka `/login`
4. Klik "Lupa Password?"
5. Masukkan email user yang terdaftar (contoh: `superadmin@simkeliling.com`)
6. Cek inbox email untuk OTP
7. Masukkan OTP dan reset password

### **Test Users:**
```
Super Admin:
- Email: superadmin@simkeliling.com
- Username: superadmin

Admin:
- Email: admin@simkeliling.com
- Username: admin
```

---

## 🔒 Keamanan

### **Validasi:**
- ✅ Email harus terdaftar di database
- ✅ OTP hanya berlaku 10 menit
- ✅ OTP hanya bisa digunakan 1 kali
- ✅ Password minimal 6 karakter
- ✅ Password harus match dengan konfirmasi

### **Best Practices:**
- OTP di-generate random 6 digit
- Password di-hash dengan bcrypt (10 rounds)
- OTP expired otomatis setelah 10 menit
- OTP ditandai `used: true` setelah digunakan

---

## 📧 Template Email OTP

Email yang dikirim berisi:
- Nama penerima
- Kode OTP 6 digit (besar & jelas)
- Informasi berlaku 10 menit
- Peringatan jika tidak request

---

## ⚠️ Troubleshooting

### **Email tidak terkirim:**
1. Cek konfigurasi `.env`
2. Pastikan App Password Gmail benar
3. Pastikan 2-Step Verification aktif
4. Cek console untuk error log

### **OTP tidak valid:**
1. Pastikan OTP belum expired (10 menit)
2. Pastikan OTP belum pernah digunakan
3. Pastikan email match dengan yang request OTP

### **Database error:**
1. Jalankan: `npx prisma db push`
2. Restart development server

---

## 📝 Notes

- OTP berlaku **10 menit**
- OTP hanya bisa digunakan **1 kali**
- User bisa request OTP baru kapan saja
- Email dikirim menggunakan **Nodemailer**
- SMTP menggunakan **Gmail** (bisa diganti provider lain)

---

## 🎯 Next Steps

Untuk production:
1. Ganti `EMAIL_USER` dan `EMAIL_PASSWORD` dengan credentials production
2. Pertimbangkan menggunakan email service seperti SendGrid, Mailgun, atau AWS SES
3. Tambahkan rate limiting untuk prevent spam
4. Tambahkan logging untuk audit trail
5. Pertimbangkan menambah captcha di form request OTP
