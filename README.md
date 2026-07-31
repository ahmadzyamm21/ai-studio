# AI Studio

Starter aplikasi produksi konten AI berbasis Next.js App Router dan Supabase.

## Jalankan

1. Ekstrak ZIP.
2. Buka folder di VS Code.
3. Jalankan `npm install`.
4. Salin `.env.local.example` menjadi `.env.local`.
5. Isi URL dan anon key Supabase.
6. Jalankan `npm run dev`.
7. Buka `http://localhost:3000`.

Aplikasi tetap dapat dibuka tanpa key Supabase karena V1 menggunakan data demo lokal.

## Database

Buka Supabase SQL Editor dan jalankan `supabase/schema.sql` saat siap mengaktifkan penyimpanan database.

## Fitur aktif

- Dashboard responsif
- Product DNA contoh Captain America
- Standar tujuh foto referensi termasuk Top + logo
- Prompt Factory interaktif
- Product, Graphic, Brand dan Negative Lock
- Copy Prompt
- Export TXT
- Halaman dasar Products, Assets, Content, Settings

## Products Module V1

Halaman `/products` sekarang memiliki:

- pencarian dan filter status,
- tambah, edit, dan hapus produk,
- detail Product DNA,
- tujuh slot foto referensi,
- preview foto,
- penyimpanan data teks di browser (`localStorage`).

Catatan: foto referensi pada V1 hanya bertahan selama sesi browser. Penyimpanan permanen akan dipindahkan ke Supabase Storage pada sprint berikutnya.
