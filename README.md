# ⚡ UniBolt ERP — Enterprise College Management System

> A production-grade, full-featured College ERP built with **HTML, CSS, JavaScript** and **Firebase** — engineered to look and function like a real SaaS product.

---

## 🚀 Features

### 🧠 Core System
- Smart Dashboard with real-time stats
- Global Search (⌘K)
- Activity Timeline
- Quick Actions

### 👤 Identity & Access
- Email/Password Login & Registration
- Google SSO
- Role-Based Access Control (RBAC)
- Permissions Engine (module-level)
- Session Management

### 👨‍🎓 Student Ecosystem
- Student 360 Dashboard
- Admission Pipeline
- Enrollment Management
- Attendance Intelligence (with risk alerts)
- Performance Analytics
- Student Documents Vault

### 👨‍🏫 Faculty & Staff System
- Faculty Dashboard
- Workload Management
- Leave Management
- Payroll Engine
- Staff Attendance

### 📚 Academic Intelligence
- Course Engine
- Timetable Generator
- Academic Calendar
- Curriculum Builder

### 🧪 Examination System
- Exam Engine
- Question Bank
- Result Processing Engine
- Gradebook & Transcripts

### 📊 Analytics & AI
- AI Dashboard
- Predictive Analytics
- Student Risk Detection
- Smart Reports & KPI Monitoring

### 💰 Finance & Accounts
- Fee Engine
- Online Payment Gateway
- Invoice & Receipt System
- Scholarships & Grants
- Budget Planner

### 📦 Operations & Infrastructure
- Hostel Management (AI Room Allocation)
- Transport Tracking (GPS)
- Library Intelligence (RFID-ready)
- Inventory & Asset Management

### 💬 Communication Hub
- Real-Time Chat
- Announcement System
- Notification Engine
- Email & SMS Gateway

### 🎯 Placement & LMS
- Placement Dashboard
- Company Portal
- Job Listings & Internships
- AI-powered Mock Interviews
- Course Player & Assignments

### 🔐 Security & Compliance
- Audit Logs (immutable)
- Data Encryption
- GDPR/Compliance Tools
- Firestore Security Rules

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Firebase (Firestore, Auth, Storage, Functions) |
| Database | Cloud Firestore (NoSQL) |
| Auth | Firebase Authentication |
| Storage | Firebase Cloud Storage |
| Functions | Firebase Cloud Functions (Node.js 18) |
| Hosting | Firebase Hosting |

---

## 📁 Project Structure

```
unibolt-erp/
├── index.html              # Landing page
├── dashboard.html          # Main dashboard (SPA)
├── 404.html
├── assets/
│   ├── css/
│   │   ├── main.css        # Core design system
│   │   ├── dashboard.css   # Layout (sidebar, topbar)
│   │   ├── animations.css  # Keyframes & transitions
│   │   ├── components.css  # Modals, tabs, toasts
│   │   └── dark-mode.css   # Theme system
│   └── js/
│       ├── firebase.js     # Firebase init
│       ├── app.js          # App bootstrapper
│       ├── auth.js         # Authentication
│       ├── router.js       # Hash-based SPA router
│       ├── utils/          # helpers, constants, validators
│       ├── services/       # Firebase data layer
│       ├── modules/        # Feature modules
│       ├── components/     # Reusable UI (toast, modal, loader)
│       └── state/          # State management
├── pages/                  # HTML pages (SPA-routed)
│   ├── auth/               # login, register, forgot-password
│   ├── dashboard/          # admin, student, faculty dashboards
│   ├── students/           # list, profile, attendance, results
│   ├── faculty/            # list, profile
│   ├── academics/          # courses, timetable
│   ├── exams/              # exams, results
│   ├── finance/            # fees, payments
│   ├── library/            # books, issue-return
│   ├── hostel/             # rooms, allocation
│   ├── transport/          # routes, vehicles
│   ├── placement/          # jobs, internships
│   ├── communication/      # chat, announcements
│   ├── settings/           # profile, preferences
│   └── support/            # help, tickets
├── firebase/               # Firebase config & rules
├── functions/              # Cloud Functions (Node.js)
├── database/               # Schema reference & sample data
├── config/                 # App config, roles, permissions
├── firebase.json
└── package.json
```

---

## ⚙️ Setup Guide

### 1. Clone & Install
```bash
git clone <repo-url>
cd unibolt-erp
npm install
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** (Email/Password + Google)
4. Create a **Firestore** database (production mode)
5. Enable **Storage**
6. Enable **Functions**
7. Get your web app config

### 3. Configure Firebase
Edit `assets/js/firebase.js` and replace the placeholder config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules,storage:rules
```

### 5. Deploy Cloud Functions
```bash
cd functions && npm install && cd ..
firebase deploy --only functions
```

### 6. Run Locally
```bash
npm run dev
# or use Firebase emulators:
npm run emulate
```

---

## 🎨 Design System

- **Theme**: Dark-first with full light mode support
- **Color**: Indigo/Purple gradient palette
- **Typography**: Inter (Google Fonts)
- **CSS Variables**: Full design token system
- **Responsive**: Mobile-first, works on all screen sizes
- **Animations**: Smooth, accessible transitions

---

## 🔒 Security

- Firestore Security Rules enforce RBAC at database level
- Storage Rules restrict file access by user
- Auth guards prevent unauthorized dashboard access
- Audit logs track all critical actions
- Security headers configured in `firebase.json`

---

## 📄 License

MIT © UniBolt ERP Team
