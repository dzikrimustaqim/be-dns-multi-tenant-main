# 🏢 Multi-Tenant API with Express, Sequelize, and PostgreSQL

Project ini adalah RESTful API berbasis Node.js yang mendukung arsitektur **multi-tenant dengan schema terpisah** pada PostgreSQL. Dibangun menggunakan **Express.js**, **Sequelize ORM**, **Umzug** untuk migrasi, dan mengikuti struktur modular agar mudah dikembangkan.

---

## 🧱 Fitur Utama

- Multi-tenant dengan schema terpisah (1 tenant = 1 schema)
- Autentikasi JWT
- Migrasi per schema menggunakan Umzug
- Struktur clean & scalable
- Manajemen schema tenant secara dinamis

---

## 📦 Teknologi

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Sequelize-CLI
- Umzug
- JWT
- Dotenv

---

## 🚀 Persiapan Pengembangan

### 1. Clone Repository

```bash
git clone https://github.com/username/multi-tenant-api.git
cd multi-tenant-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment
Buat file .env berdasarkan .env.example (jika ada):

```bash
# Server Configuration
NODE_ENV=development
PORT=3001

# Database Configuration
# DB_HOST=172.19.0.2
DB_HOST=127.0.0.1
DB_PORT=5438
DB_NAME=sekolah
DB_USER=user
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Migration Configuration
RUN_MIGRATIONS_ON_STARTUP=true
RUN_TENANT_MIGRATIONS_ON_STARTUP=true

# Logging
LOG_LEVEL=debug

# Email Notifications (optional)
NOTIFICATIONS_ENABLED=false
EMAIL_NOTIFICATIONS_ENABLED=false
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=user@example.com
EMAIL_PASSWORD=yourpassword
EMAIL_FROM=noreply@example.com
EMAIL_TO=admin@example.com

```

---

## 🧪 Menjalankan Secara Lokal

### 1. Setup Database

```bash
CREATE DATABASE multi_tenant_db;
```

### 2. Jalankan Migrasi Awal (schema public)

```bash
npx sequelize-cli db:migrate --env development --migrations-path src/migrations/public
```

### 3. Jalankan Seeder Jika Diperlukan

```bash
npx sequelize-cli db:seed:all --env development --seeders-path src/seeders/public
```

### 4. Jalankan Server

```bash
npm run dev
```

---

## 🧩 Struktur Proyek

```bash
multi-tenant-api/
├── src/
│   ├── config/           # Konfigurasi database
│   ├── controllers/      # Logika controller
│   ├── middlewares/      # Middleware global & tenant
│   ├── migrations/       # Migrasi public dan tenant
│   ├── models/           # Model Sequelize
│   ├── routes/           # Routing API
│   ├── seeders/          # Data awal
│   ├── services/         # Business logic
│   ├── utils/            # Helper & tools
│   ├── app.js            # Inisialisasi express
│   └── server.js         # Entry point
```

---

## 🧰 Tools CLI

Menambahkan Migrasi Tenant

```bash
npx sequelize-cli migration:generate --name create-user --migrations-path src/migrations/tenant
```

Menambahkan Migrasi Public

```bash
npx sequelize-cli migration:generate --name create-tenant --migrations-path src/migrations/public
```

---

## 🏗️ Deployment ke Server (Ubuntu)

### 1. Clone Project di Server

```bash
git clone https://github.com/username/multi-tenant-api.git
cd multi-tenant-api
```

### 2. Install Dependencies & Setup Environment

```bash
npm install
cp .env.example .env
nano .env
```

### 3. Setup Database (jika belum)

Buat database baru

```bash
sudo -u postgres createdb multi_tenant_db
```

Enable uuid-ossp extension on postgres

```bash
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Jalankan skrip plpgsql berikut untuk otomatisasi

```bash
plpgsql/update_siswa_status.plpgsql
plpgsql/trigger_insert_siswakelas.plpgsql
plpgsql/update_total_biaya_tahunan.plpgsql
```


### 4. Jalankan Migrasi

```bash
npx sequelize-cli db:migrate --env production --migrations-path src/migrations/public
```

### 5. Jalankan Server

```bash
npm start
```

### 6. (Opsional) Gunakan PM2 untuk Production

```bash
npm install -g pm2
pm2 start src/server.js --name multi-tenant-api
pm2 save
pm2 startup
```

---

## 🔐 Autentikasi

Gunakan JWT untuk autentikasi. Setelah login berhasil, token digunakan untuk mengakses endpoint yang dilindungi.

Header:

```bash
Authorization: Bearer <token>
```

---

## 📎 Catatan

Saat tenant baru dibuat, sistem otomatis:

- Membuat schema baru

- Menjalankan migrasi schema tersebut

- Siap digunakan secara isolatif

---

## 📖 Sequelize CLI Command

- generate model and migration with specific path
```bash
npx sequelize-cli model:generate --name ContohSaja --attributes name:string,email:string,jenis_kelamin:boolean --migrations-path src/migrations/public --underscored 
```

---

## 📖 Migration and Seeder Script

Cara Penggunaan:

- Migrasi Public Schema:
```bash
npm run db:migrate
npm run db:migrate:status
npm run db:migrate:undo
```

- Migrasi Tenant Specific:
```bash
npm run db:migrate:tenant -- --tenant=tenant1
npm run db:migrate:tenant:undo -- --tenant=tenant1
```

- Migrasi Semua Tenant:
```bash
npm run db:migrate:tenant:all
```

- Seeder Public Schema:
```bash
npm run db:seed -- --seed=20230101000000-demo-tenants.js
npm run db:seed:all
npm run db:seed:undo -- --seed=20230101000000-demo-tenants.js
```

- Seeder Tenant Specific:
```bash
npm run db:seed:tenant -- --tenant=tenant1 --seed=20230101000001-demo-users.js
npm run db:seed:tenant:all -- --tenant=tenant1
```
---


# 🧭 Git Workflow Guide

Panduan penggunaan Git untuk kolaborasi tim.

---

## ✅ Branching Strategy

| Branch        | Fungsi                          |
|---------------|----------------------------------|
| `main`        | Branch utama, selalu stabil dan siap rilis |
| `feature/*`   | Branch untuk fitur baru          |
| `bugfix/*`    | Branch untuk perbaikan bug       |
| `hotfix/*`    | Branch perbaikan mendesak di `main` (opsional) |

---

## 🔄 Workflow Developer

### 1. Sync dengan branch `main`
```bash
git checkout main
git pull origin main
```

### 2. Buat branch baru untuk fitur/bug
```bash
git checkout -b feature/<nama-fitur>
# contoh:
git checkout -b feature/login-form
```

### 3. Commit perubahan
```bash
git add .
git commit -m "feat: buat tampilan form login"
```

### 4. Buat Pull Request ke `main` setelah selesai (review ringan)

```bash
git push origin feature/login-form
# Buat PR ke `main` via GitHub/GitLab/Bitbucket
```

### 5. Hapus branch jika sudah selesai
```bash
git branch -d feature/login-form
git push origin --delete feature/login-form
```

---

## 🧾 Format Penamaan Branch

| Jenis     | Format                    | Contoh                      |
|-----------|---------------------------|-----------------------------|
| Fitur     | `feature/<nama-fitur>`    | `feature/user-profile`      |
| Bugfix    | `bugfix/<nama-bug>`       | `bugfix/invalid-token`      |
| Hotfix    | `hotfix/<nama-hotfix>`    | `hotfix/crash-on-startup`   |

---

## ✅ Tips Kerja Tim

- Tarik update terbaru dari `main` setiap hari (`git pull origin main`)
- Commit kecil, deskriptif, dan sering
- Selesaikan branch dalam waktu maksimal 3 hari
- Gunakan chat/standup untuk koordinasi siapa mengerjakan apa

---

## 🚫 Hal yang Harus Dihindari

- Branch yang terlalu lama tanpa merge
- Commit besar-besaran sekaligus
- Mengedit file yang sama tanpa komunikasi
- Merge tanpa update `main` terlebih dahulu

---

## 📖 Lisensi

Hak Cipta © 2025 Mifta Digital Solusi

Proyek ini adalah milik eksklusif dan hanya dilisensikan untuk digunakan oleh:
Pesantren Darunnajah

Dilarang keras menggandakan, mendistribusikan, menjual ulang, atau mengubah perangkat lunak ini tanpa izin tertulis dari pemilik.

Lisensi ini tidak bersifat open source dan tunduk pada ketentuan kontrak layanan atau pengembangan perangkat lunak.


