# Cek Warung Mdr

Aplikasi "Cek Warung Mdr" adalah sistem manajemen toko atau warung yang dirancang untuk membantu pengelolaan data pengguna dan inventaris barang secara efisien. Aplikasi ini cocok untuk warung atau toko kecil hingga menengah yang membutuhkan solusi sederhana namun fungsional untuk operasional sehari-hari.

## Fitur Utama

*   **Manajemen Pengguna:**
    *   Sistem peran pengguna (ADMIN dan PETUGAS) untuk mengontrol akses dan fungsionalitas.
    *   Manajemen data pengguna termasuk nama, email, dan password.
*   **Manajemen Barang:**
    *   Pencatatan detail barang seperti nama, isi (kuantitas per unit terkecil), harga per pack, dan harga per pcs.
    *   Memudahkan pemantauan stok dan harga jual.
*   **Autentikasi Aman:**
    *   Fitur login pengguna dengan mekanisme autentikasi yang mendukung `bcryptjs` untuk keamanan password.
*   **Sinkronisasi Data:**
    *   Dilengkapi dengan rute API untuk sinkronisasi data, memungkinkan pembaruan data yang konsisten antara IndexedDB (client-side) dan database server.
*   **Laporan & Ekspor Data:**
    *   Kemampuan untuk menghasilkan dan mengekspor laporan atau data dalam format PDF dan Excel, menggunakan pustaka seperti `jspdf`, `jspdf-autotable`, `pdf-lib`, `xlsx`, dan `file-saver`.

## Teknologi yang Digunakan

Proyek ini dibangun menggunakan kombinasi teknologi modern untuk performa dan skalabilitas:

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (React Framework)
    *   [React](https://react.dev/) (Library JavaScript untuk UI)
    *   [Tailwind CSS](https://tailwindcss.com/) (Framework CSS Utility-First)
    *   [Dexie.js](https://dexie.org/) (Library IndexedDB untuk penyimpanan data client-side)
    *   [Lucide React](https://lucide.dev/) (Koleksi ikon)
*   **Backend:**
    *   Next.js API Routes (Untuk endpoint API)
    *   [Prisma](https://www.prisma.io/) (ORM untuk database)
    *   [PostgreSQL](https://www.postgresql.org/) (Sistem Manajemen Database Relasional)
*   **Autentikasi & Keamanan:**
    *   `bcryptjs` (Untuk hashing password)
*   **Utilities:**
    *   `uuid` (Untuk generasi UUID)
*   **Development Tools:**
    *   Babel Plugin React Compiler
    *   ESLint (Untuk linting kode)
    *   TypeScript (Superset JavaScript dengan tipe)

## Instalasi dan Penggunaan (Pengembangan Lokal)

Untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda, ikuti langkah-langkah berikut:

1.  **Persyaratan:**
    *   Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi terbaru disarankan) dan [npm](https://www.npmjs.com/) atau [Yarn](https://yarnpkg.com/).
    *   Anda memerlukan instance database [PostgreSQL](https://www.postgresql.org/) yang sedang berjalan.

2.  **Kloning Repositori:**
    ```bash
    git clone <URL_REPO_GITHUB>
    cd cek-warung-mdr
    ```

3.  **Instal Dependensi:**
    ```bash
    npm install
    # atau
    yarn install
    ```

4.  **Konfigurasi Database:**
    *   Buat file `.env` di root proyek Anda.
    *   Tambahkan variabel lingkungan `DATABASE_URL` yang menunjuk ke database PostgreSQL Anda. Contoh:
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
        ```

5.  **Migrasi dan Generasi Prisma Client:**
    *   Jalankan migrasi database (jika ini adalah inisialisasi pertama proyek Anda):
        ```bash
        npx prisma migrate dev --name init
        ```
    *   Jika Anda hanya ingin me-regenerate Prisma Client (setelah perubahan skema):
        ```bash
        npx prisma generate
        ```

6.  **Seed Data (Opsional):**
    *   Jika ada data awal yang perlu dimasukkan ke database:
        ```bash
        npm run prisma:seed
        # atau jika didefinisikan di package.json: npm run seed
        ```

7.  **Jalankan Aplikasi:**
    *   Untuk memulai server pengembangan:
        ```bash
        npm run dev
        ```
    *   Aplikasi akan berjalan di `http://localhost:3000` (atau port lain yang tersedia).

## Struktur Proyek

```
. (root proyek)
├── prisma/                  # Skema dan migrasi Prisma
│   └── schema.prisma
├── public/                  # File statis
├── src/
│   ├── app/                 # Next.js App Router (pages, layouts, API routes)
│   │   ├── (auth)/          # Rute terkait autentikasi (misal: login)
│   │   ├── (dashboard)/     # Rute terkait dashboard (misal: akun, master, rekap)
│   │   └── api/             # API Routes
│   ├── components/          # Komponen UI reusable
│   ├── db/                  # Konfigurasi database atau skema (selain prisma/schema.prisma)
│   └── lib/                 # Utilitas, fungsi pembantu, konfigurasi Dexie.js, dll.
├── .env                     # Variabel lingkungan
├── package.json             # Dependensi dan script proyek
└── README.md                # Dokumentasi proyek ini
```

## Kontribusi

Silakan ajukan issue atau pull request jika Anda memiliki saran atau menemukan bug.

## Lisensi

## Trigger deploy auth login
