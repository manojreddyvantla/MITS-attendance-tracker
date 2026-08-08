# MITS Attendance AI

### Full Academic Title:
**"MITS Attendance AI: An Intelligent Attendance Tracking, Prediction and Recommendation System"**

---

## 📌 Project Overview
**MITS Attendance AI** is a state-of-the-art full-stack web application designed for students of Madanapalle Institute of Technology & Science (MITS) to track, calculate, predict, and optimize their academic class attendance.

By unifying normalized MITS attendance data retrieval with exact integer calculation engines and LLM-powered prediction algorithms, the system eliminates attendance shortage condonation risks and provides personalized recovery plans.

---

## ✨ Key Features
1. **Student Application Login**: Secure JWT & bcrypt authentication decoupled from MITS login credentials.
2. **MITS Attendance Sync Provider**: Modular provider architecture (`server/services/mits/`) supporting live or safe mock integration modes (`MITS_INTEGRATION_MODE=mock`).
3. **Overall & Subject-wise Metrics**: Live status indicators:
   - **GREEN**: Attendance $\ge 75\%$ (SAFE)
   - **YELLOW**: Attendance $70\% - 74.99\%$ (WARNING)
   - **RED**: Attendance $< 70\%$ (CRITICAL)
4. **Attendance Calculator**: Exact integer math calculations for required consecutive classes and safe bunks.
5. **Predictive Risk Engine**: Classifies overall and subject-level risk into **LOW**, **MEDIUM**, **HIGH**, and **CRITICAL** tiers.
6. **Recharts Trend Analytics**: Bar charts comparing subject attendance against target thresholds.
7. **Interactive Attendance Calendar**: Monthly visual grid displaying daily present/absent logs.
8. **ChatGPT-style AI Assistant**: Context-aware LLM advisor answering custom student queries with real data.
9. **Smart Notification Center**: Real-time alerts for low attendance thresholds and sync updates.
10. **Customizable Target Thresholds**: Configurable target attendance (65%, 70%, 75%, 80%, 85%, 90%).

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18 + Vite
- **Styling**: Tailwind CSS + Glassmorphism Aesthetics
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js
- **Architecture**: RESTful API design
- **Security**: Helmet, CORS, Express-Rate-Limit, Cookie-Parser, bcryptjs, JsonWebToken

### Database
- **Primary**: MySQL (`database/schema.sql`)
- **Fallback**: SQLite (zero-config local runnability)

---

## 📁 Project Architecture & Folder Structure

```
mits-attendance-ai/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Layout, StatusBadge, ProgressBar, AIInsightCard, SubjectModal
│   │   ├── context/            # AuthContext, ThemeContext, AttendanceContext
│   │   ├── pages/              # Landing, Login, Dashboard, Subjects, Calculator, Prediction, Calendar, Assistant, Notifications, Profile, Settings
│   │   ├── index.css           # Global Tailwind CSS styles
│   │   ├── App.jsx             # Router configuration
│   │   └── main.jsx            # Entry point
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js + Express Backend
│   ├── config/                 # db.js (MySQL/SQLite), jwt.js
│   ├── controllers/            # auth, student, attendance, calculator, prediction, ai, notification
│   ├── middleware/             # authMiddleware, errorHandler
│   ├── routes/                 # Express API routes
│   ├── services/
│   │   ├── mits/               # mockMitsProvider, mitsClient, mitsAuth, mitsAttendance, mitsParser
│   │   ├── ai/                 # aiService (LLM API + context-aware fallback)
│   │   ├── calculator/         # attendanceCalculator math engine
│   │   └── prediction/         # riskEngine
│   ├── tests/                  # Backend test runner and math unit tests
│   ├── server.js               # Main Express app
│   └── package.json
├── database/
│   └── schema.sql              # MySQL DDL Schema
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- (Optional) MySQL Server 8.0+

### 1. Installation
Run the following in the project root:
```bash
npm run install:all
```
This installs dependencies for root, server, and client.

### 2. Environment Variables Setup
Copy `.env.example` to `.env`:
```env
PORT=5000
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_NAME=mits_attendance
JWT_SECRET=mits_attendance_ai_jwt_secret_key_2026
AI_API_KEY=
MITS_INTEGRATION_MODE=mock
```

### 3. Database Setup
- For **MySQL**: Create a database named `mits_attendance` and execute `database/schema.sql`.
- For **SQLite Fallback**: No manual database setup required! The server will automatically initialize an SQLite database in `server/data/mits_attendance.sqlite`.

---

## 🧪 Running Tests & Starting the Application

### Run Backend Verification Tests
```bash
npm test
```

### Start Backend Server
```bash
npm run server
```
Server runs at: `http://localhost:5000`

### Start Frontend Application
```bash
npm run client
```
Client runs at: `http://localhost:5173`

---

## 🔒 MITS Integration & Security Compliance
- The MITS provider in `server/services/mits/` retrieves permitted attendance data.
- Never stores student MITS passwords in plaintext.
- Does not bypass CAPTCHA, OTP, or security mechanisms.
- Features high-fidelity sample data for 6 CSE-AI/ML subjects in mock mode (`MITS_INTEGRATION_MODE=mock`).

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & issue JWT |
| `POST` | `/api/auth/register` | Register new student profile |
| `GET` | `/api/attendance` | Fetch all subject attendance records |
| `GET` | `/api/attendance/overall` | Fetch overall percentage & metrics |
| `POST` | `/api/attendance/sync` | Trigger MITS provider attendance sync |
| `POST` | `/api/attendance/calculate` | Compute exact safe bunks & required classes |
| `POST` | `/api/attendance/predict` | Generate risk tier and recovery advice |
| `POST` | `/api/ai/chat` | Send prompt to ChatGPT-style assistant |
| `GET` | `/api/notifications` | Fetch unread notifications |
