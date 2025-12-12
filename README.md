# 🧠 Student Progress Dashboard


Sebuah platform analitik pembelajaran yang dirancang untuk membantu siswa, dosen, dan institusi memahami perkembangan akademik secara lebih komprehensif melalui visualisasi data dan insight berbasis analisis.


# 📌 Deskripsi Proyek

Student Progress Dashboard adalah website yang menampilkan perkembangan belajar siswa secara real-time melalui grafik, statistik, dan insight personal. Proyek ini dibuat untuk mengatasi masalah umum pada platform pembelajaran tradisional yang biasanya hanya menampilkan nilai akhir tanpa analisis mendalam mengenai:

- Gamifikasi leveling 
- Pola belajar siswa
- Progres harian/mingguan
- Perbandingan performa

Dashboard ini ditujukan untuk mahasiswa, instruktur, dan tenaga kependidikan di bidang teknologi atau pendidikan modern.

# 🚀 Fitur Utama

- 📊 Dashboard Progres Siswa (grafik, ringkasan nilai, tracking performa)

- 🧠 Analisis Gaya Belajar

- 📝 Tracking Tugas & Aktivitas Pembelajaran

- 🧾 Laporan dan Insight Otomatis

- 🧩 Rekomendasi Materi Belajar Personal

- 🔐 Manajemen User & Role (Admin, Dosen, Siswa)

- ⚙️ API untuk integrasi data akademik

# 🛠️ Tech Stack

## Frontend:

- React 

- CSS

## Backend:

- Node.js (Hapi)

- JWT Authentication

## Database:

- PostgreSQL 

## Git & GitHub

## Hosting 
- Netlify
- Railway

# 📁 Struktur Project
```
REBE/
├── Backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── authentications/
│   │   │   │   ├── handler.js
│   │   │   │   ├── index.js
│   │   │   │   └── routes.js
│   │   │   ├── users/
│   │   │   │   ├── handler.js
│   │   │   │   ├── index.js
│   │   │   │   └── routes.js
│   │   ├── exceptions/
│   │   │   ├── AuthenticationError.js
│   │   │   ├── AuthorizationError.js
│   │   │   ├── ClientError.js
│   │   │   ├── InvariantError.js
│   │   │   └── NotFoundError.js
│   │   ├── services/postgres/
│   │   │   ├── AuthenticationsService.js
│   │   │   └── UsersService.js
│   │   ├── tokenize/
│   │   │   └── TokenManager.js
│   │   ├── validator/
│   │   │   ├── authentications/
│   │   │   │   ├── index.js
│   │   │   │   └── schema.js
│   │   │   ├── users/
│   │   │   │   ├── index.js
│   │   │   │   └── schema.js
│   │   ├── server.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package-lock.json
│   └── package.json
│
├── Frontend/
│   ├── public/
│   │   ├── AI Learning Insight.png
│   │   └── vite.svg
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── AuthPage.jsx
│   │   │   └── assets/
│   │   │       └── noacc.svg
│   │   ├── components/
│   │   │   ├── Loading.jsx
│   │   │   ├── LoginInput.jsx
│   │   │   └── RegisterInput.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── styles/
│   │   │   ├── auth2.css
│   │   │   ├── loading.css
│   │   │   └── styles.css
│   │   ├── utils/
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
└── README.md

```

