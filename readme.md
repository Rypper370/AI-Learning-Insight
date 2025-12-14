# AI Learning Insight

Backend: Hapi + Supabase; Frontend: React + Vite; Model ML: TF to Node.

## Struktur Proyek (ringkas)
- [REBE/Backend/src/server.js](REBE/Backend/src/server.js:17) — Bootstrap Hapi + CORS + registrasi rute.
- [REBE/Backend/src/routes/auth.js](REBE/Backend/src/routes/auth.js:9) — Rute autentikasi (signup/login/profile/logout).
- [REBE/Backend/src/routes/predictions.js](REBE/Backend/src/routes/predictions.js:5) — Endpoint inferensi & penyimpanan hasil model.
- [REBE/Backend/src/routes/cities.js](REBE/Backend/src/routes/cities.js:134) — CRUD kota dan pembagian data kota ke user secara seimbang.
- [REBE/Backend/src/routes/leaderboard.js](REBE/Backend/src/routes/leaderboard.js:6) — Leaderboard berlapis.
- [REBE/Backend/src/config/supabase.js](REBE/Backend/src/config/supabase.js:1) — Inisialisasi klien Supabase (public & service).
- [REBE/Backend/src/validators/schemas.js](REBE/Backend/src/validators/schemas.js:1) — Skema Zod untuk auth.
- [REBE/Frontend/src/main.jsx](REBE/Frontend/src/main.jsx:1) — Entrypoint SPA Vite + React.
- [REBE/Frontend/src/App.jsx](REBE/Frontend/src/App.jsx:1) — Shell aplikasi.
- [ML/model_recommendation_final.json](ML/model_recommendation_final.json:1) — Konfigurasi/metadata model K-Means Classifier.

## Instalasi Backend
1. Salin `.env.example` menjadi `.env` lalu isi:
```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
SUPABASE_SHARED_BUCKET=...
SUPABASE_SHARED_PROFILE_PICTURES_PATH=...
PORT=3000
HOST=0.0.0.0
```
2. Install dependensi: `cd REBE/Backend && npm install`
3. Opsional seed/inisialisasi data: `npm run init-data`
4. Jalankan: dev `npm run start:dev` (nodemon) atau produksi `npm start`

## Instalasi Frontend
1. Salin `REBE/Frontend/.env.example` menjadi `.env`, set `VITE_API_URL` (mis. `http://localhost:3000`).
2. Install dependensi: `cd REBE/Frontend && npm install`
3. Jalankan dev server: `npm run dev`

## API (singkat)
Base URL default `http://localhost:3000` (lihat [server.js](REBE/Backend/src/server.js:19)).

### Auth — [auth.js](REBE/Backend/src/routes/auth.js:9)
- `POST /auth/signup` — `{ email, password, name }` → buat user.
- `POST /auth/login` — `{ email, password }` → sesi/login.
- `GET /auth/me` — Header `Authorization: Bearer <token>` → profil singkat auth.
- `GET /auth/me-full` — Header bearer → profil publik + gaya belajar + avatar terselesaikan.
- `POST /auth/logout` — Respons logout stateless.

### Predictions — [predictions.js](REBE/Backend/src/routes/predictions.js:5)
- `GET /api/model/info` — Info model & urutan fitur.
- `GET /api/predict/me?user_id={id}` — Ambil prediksi tersimpan.
- `POST /api/predict` — Body: `{ total_submissions, avg_submission_rating, avg_exam_score, total_journeys_completed, avg_speed_ratio }` → prediksi langsung.
- `POST /api/predict/save` — Body: `{ user_id, ...fitur }` → prediksi + simpan ke `user_learning_predictions` & update user.
- `POST /api/predict/batch` — Body: `{ users: [{ user_id, total_submissions, avg_submission_rating, avg_exam_score, total_journeys_completed, avg_speed_ratio }] }` → prediksi batch.

### Cities — [cities.js](REBE/Backend/src/routes/cities.js:134) (Membuat Data Users menjadi lebih rapih dengan dummy data)
- `POST /cities` — `{ name, type?, province? }` → tambah kota.
- `POST /cities/bulk` — `{ cities: [...] }` → tambah banyak.
- `POST /cities/seed` — Seed daftar kota Indonesia.
- `GET /cities` — List kota.
- `POST /users/{userId}/assign-city` — Assign kota seimbang ke user.
- `POST /users/bulk-assign-cities` — Assign seimbang massal.
- `POST /users/assign-all-cities` — Assign ulang seluruh user.
- `GET /cities/stats` — Statistik distribusi kota.

### Leaderboard — [leaderboard.js](REBE/Backend/src/routes/leaderboard.js:6)
- `GET /api/leaderboard?per_page=30&page=1` — Leaderboard berpaginasi (urutan level lalu xp), sertakan URL avatar yang tersedia.

## Catatan Supabase
Setel konfigurasi auth sesuai [REBE/Backend/supabase/migrations/readme.md](REBE/Backend/supabase/migrations/readme.md:1) sebelum impor migrasi Supabase.
