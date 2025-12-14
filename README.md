# 🧠 Student Progress Dashboard

Sebuah platform analitik pembelajaran yang dirancang untuk membantu siswa, dosen, dan institusi pendidikan memahami perkembangan akademik secara komprehensif melalui visualisasi data, analisis perilaku belajar, dan insight berbasis data.

---

## 📌 Deskripsi Proyek

**Student Progress Dashboard** adalah aplikasi web yang menampilkan perkembangan belajar siswa secara real-time melalui grafik interaktif, statistik performa, serta insight personal berbasis analisis data.

Proyek ini dikembangkan untuk menjawab permasalahan umum pada platform pembelajaran tradisional yang umumnya hanya menampilkan **nilai akhir**, tanpa memberikan pemahaman mendalam mengenai:

- Gamifikasi dan sistem leveling belajar
- Pola dan kebiasaan belajar siswa
- Progres belajar harian dan mingguan
- Perbandingan performa antar periode atau individu

Dashboard ini ditujukan untuk:
- 🎓 Mahasiswa / Siswa
- 👨‍🏫 Dosen / Instruktur
- 🏫 Institusi pendidikan berbasis teknologi

---

## 🚀 Fitur Utama

- 📊 **Dashboard Progres Siswa**  
  Visualisasi nilai, grafik progres, dan ringkasan performa

- 🧠 **Analisis Gaya Belajar**  
  Identifikasi kecenderungan gaya belajar siswa

- 📝 **Tracking Tugas & Aktivitas**  
  Monitoring aktivitas pembelajaran secara berkala

- 🧾 **Insight & Laporan Otomatis**  
  Rangkuman performa belajar berbasis data

- 🧩 **Rekomendasi Materi Personal**  
  Saran pembelajaran sesuai pola belajar

- 🔐 **Manajemen User & Role**  
  Admin, Dosen, dan Siswa

- ⚙️ **RESTful API**  
  Mendukung integrasi data akademik

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- CSS

### Backend
- Node.js
- Hapi Framework
- JWT Authentication with Supabase Auth

### Database
- PostgreSQL
- Supabase (Managed PostgreSQL)

### DevOps & Tools
- Git & GitHub
- Netlify (Frontend Hosting)
- AWS (Backend Hosting)

---

## 📈 Arsitektur Sistem

Aplikasi menggunakan arsitektur **Client–Server** dengan pemisahan yang jelas:

- **Frontend**
  - Menampilkan UI dashboard dan visualisasi data
  - Mengelola state, autentikasi, dan interaksi pengguna

- **Backend**
  - Menyediakan REST API
  - Mengelola autentikasi & otorisasi
  - Menangani business logic

- **Database**
  - Menyimpan data user, progres belajar, dan aktivitas

- **Machine Learning Layer**
  - Analisis perilaku belajar
  - Klasifikasi gaya belajar
  - Penyediaan insight personal

---

## 🤖 Machine Learning Integration

### Workflow

1. **Data Collection**  
   - Aktivitas login
   - Riwayat tugas dan nilai
   - Durasi dan frekuensi belajar

2. **Preprocessing**  
   - Normalisasi data
   - Feature extraction
   - Labeling dataset

3. **Modeling**  
   - Model klasifikasi dasar
   - Output: kategori gaya belajar (Visual, Auditori, Kinestetik, Campuran)

4. **Insight Delivery**  
   - Ditampilkan pada dashboard
   - Digunakan untuk rekomendasi materi belajar

---

## 🔗 API Documentation (Ringkas)

Base URL:
```
/api
```

### Authentication
- `POST /auth/signup` – Registrasi user
- `POST /auth/login` – Login
- `GET /auth/me` - Mengembalikan data Users dari auth.users di DB.
- `GET /auth/me-full` – Mengembalikan data Users sebagai 'Profile' di public.users di DB. 

### Leaderboard
- `GET /api/leaderboard` - Mengambil data untuk ditampilkan ke Leaderboard.

### Predictions
- `GET /api/model/info` - Mendapatkan info dari model.
- `GET /api/predict/me` - Mendapatkan data learning type dari user dari database.
- `POST /api/predict/save` - Melakukan prediksi baru dan menyimpannya ke database.

> Endpoint progres, insight, dan laporan akan dikembangkan pada tahap selanjutnya.

---

## 📦 Installation

### 1. Clone Repository
```bash
git clone https://github.com/Rypper370/AI-Learning-Insight.git
cd AI-Learning-Insight
```

### 2. Install Dependencies
```bash
npm install dotenv
```

### 3. Setup Environment Variables

Buat file `.env` pada root directory **Backend**:
```env
HOST=Your_Host
PORT=Your_Port

PGUSER=Your_User_PG
PGHOST=Your_Host_PG
PGPASSWORD=Your_Password_PG
PGDATABASE=Your_Database_PG
PGPORT=Your_Port_PG

ACCESS_TOKEN_KEY=Your_ACCESS_TOKEN_KEY
REFRESH_TOKEN_KEY=Your_REFRESH_TOKEN_KEY
ACCESS_TOKEN_AGE=Your_ACCESS_TOKEN_AGE
```

### 4. Menjalankan Aplikasi

**Change directory ke subdir masing-masing baik itu REBE/Frontend atau REBE/Backend terlebih dahulu!**

**Frontend**
```bash
npm run dev
```

**Backend**
```bash
npm run start
```

---

## 📁 Struktur Project

```
ML/
├── Dataset
├── Machine Learning Model
├── Notebook

REBE/
├── Backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── config/
|   |   |   ├── routes/
|   |   |   ├── utils/
|   |   |   ├── validators/
│   │   │   └── server.js
│   │   ├── supabase/
│   │   ├── .env.example
│   │   └── package.json
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── Pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── styles/
│   │   └── utils/
│   ├── index.html
│   ├── eslint.config.js
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🧪 Testing

- Backend: Postman (Manual API Testing)
- Frontend: Manual UI Testing

> Automated testing direncanakan pada tahap pengembangan berikutnya.

---

## 🛣️ Roadmap Pengembangan

- [ ] Dashboard analytics lanjutan
- [ ] Perbandingan performa antar siswa
- [ ] Model machine learning lanjutan
- [ ] Export laporan (PDF)
- [ ] Sistem notifikasi dan reminder belajar

---

## 👨‍💻 Author

- M172D5Y0388 – Christian Michael Halim – Machine Learning  
- M172D5X1839 – Sheany Multa Kandi – Machine Learning  
- R172D5Y1983 – Yohanes Aldo Anantha – React & Backend with AI 
- R271D5Y1063 – Malik Bazil Rabbani – React & Backend with AI 
- R172D5Y0940 – Karan – React & Backend with AI  

Proyek ini dikembangkan sebagai eksplorasi dan implementasi:
- Web Development
- Data Analytics
- Machine Learning

dalam konteks **pendidikan digital modern**.

---

> _Student Progress Dashboard bertujuan menjadi fondasi sistem pembelajaran digital yang lebih adaptif, transparan, dan berorientasi pada perkembangan individu._

