# Game Time Control (Node.js + Express + MySQL)

## Kebutuhan
- Node.js 18 atau lebih baru
- MySQL / MariaDB yang sedang berjalan (XAMPP, Laragon, atau MySQL biasa)

## Cara menjalankan
1. Buka folder ini di VS Code, lalu buka terminal (menu Terminal > New Terminal).
2. Salin `.env.example` menjadi `.env`, lalu sesuaikan `DB_USER`, `DB_PASSWORD`, dan `JWT_SECRET`.
3. Install dependensi:
   ```
   npm install
   ```
4. Jalankan server:
   ```
   npm start
   ```
5. Buka http://localhost:3000

Saat pertama kali dijalankan, server otomatis membuat database `game_time_control`,
semua tabel, akun demo, dan daftar game awal.

## Akun demo
- Admin: `admin` / `admin123`
- User: `player` / `player123`

Ganti password akun demo sebelum dipakai di luar komputer sendiri.

## Struktur
```
server.js        API Express (auth, game, user, riwayat)
db.js            koneksi MySQL, pembuatan tabel, data awal
database.sql     referensi struktur tabel (opsional)
public/          tampilan (index.html, style.css, views.js, script.js)
```

## Catatan
- Password disimpan dalam bentuk hash (bcrypt), login memakai token JWT.
- Riwayat bermain sekarang tersimpan per pengguna. Admin melihat riwayat semua pemain.
- Ukuran gambar dibatasi 2 MB. Jika upload gambar gagal, naikkan `max_allowed_packet` di MySQL.
