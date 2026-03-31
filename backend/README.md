# Backend MVP - Service System

Backend ini sudah disesuaikan dengan kontrak frontend yang ada sekarang dan memakai Prisma + SQLite supaya cepat dipakai untuk testing lapangan.

## Menjalankan

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run start:dev
```

Base URL API: `http://localhost:3000/api`

## Akun seed

- admin@service.com / Admin123!
- frontline@service.com / Frontline123!
- manager@service.com / Manager123!
- mechanic@service.com / Mechanic123!

## Endpoint inti

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET/POST /api/customers`
- `GET/POST /api/vehicles`
- `GET/POST /api/users`
- `GET/POST /api/work-orders`
- `GET/POST /api/services`
- `GET /api/services/:id`
- `PATCH /api/services/:id/status`
- `POST /api/services/:id/notes`

## Catatan

- Autentikasi sudah menggunakan JWT signed token (dengan expiry) + password hash bcrypt.
- Jalankan seed ulang setelah update keamanan agar password awal tersimpan sebagai hash.
- Untuk readiness produksi, gunakan secret kuat pada JWT_SECRET dan jangan pakai default credential.
