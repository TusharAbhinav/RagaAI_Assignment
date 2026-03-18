# HealthHub — B2B Healthcare SaaS Dashboard

A modern, responsive healthcare management dashboard built with React, TypeScript, and Vite.

## Features

- **Authentication** — Google Sign-in via Firebase + email/password login + demo mode (no setup required)
- **Dashboard** — Key metrics, patient admissions trend chart, department overview, recent patients table
- **Patient Management** — Grid/list toggle, search, status filtering, patient detail dialog with appointment reminders
- **Analytics** — Monthly trends, weekly patient flow, condition distribution — all with responsive Recharts charts
- **Settings** — Notification preferences with toggle controls
- **Push Notifications** — Service worker-based notifications; appointment reminders fire after a 5-second delay (demo)
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript + Vite 8 |
| Styling | Tailwind CSS v3 + shadcn/ui |
| State | Zustand with persist middleware |
| Auth | Firebase Authentication |
| Charts | Recharts |
| Routing | React Router v7 |
| Notifications | Service Worker (Web Push API) |

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+

### Installation

```bash
git clone https://github.com/TusharAbhinav/RagaAI_Assignment.git
cd RagaAI_Assignment
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase project credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> If Firebase is not configured, the app automatically falls back to demo mode.

### Run

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Demo Login

No Firebase setup needed. On the login page click **"Continue as Demo User"** or use:

```
Email:    demo@healthcare.com
Password: demo123
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # AppLayout, Navbar, Sidebar
│   ├── patients/      # PatientCard, PatientRow, PatientDetailDialog
│   └── ui/            # shadcn/ui components
├── config/            # Firebase config
├── data/              # Mock data
├── lib/               # Utility helpers
├── pages/             # Dashboard, Patients, Analytics, Settings, Login
├── services/          # Notification service
├── store/             # Zustand stores (auth, patient, notification)
└── types/             # TypeScript interfaces
```
