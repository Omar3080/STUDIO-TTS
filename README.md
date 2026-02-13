# STUDIO Sales Management (Arabic RTL)

نظام إدارة مبيعات احترافي جاهز للتشغيل، مبني بـ Node.js + Prisma + React + Electron.

## Project Structure
- `backend/` API + Prisma + SQLite/PostgreSQL
- `frontend/` React (Vite) + Tailwind + i18next (RTL)
- `desktop/` Electron wrapper
- `docs/` additional documentation

## Requirements
- Node.js 20+
- npm 10+

## Quick Start
```bash
npm install
cp backend/.env.example backend/.env
npm run prisma:generate -w backend
npm run prisma:migrate -w backend -- --name init
npm run prisma:seed -w backend
npm run dev
```

Frontend: `http://localhost:5173`
Backend Swagger: `http://localhost:4000/api-docs`

### Default Admin
- Username: `admin`
- Password: `admin123`

## Production Build
```bash
npm run build
npm run start -w backend
npm run preview -w frontend
```

## Build Windows EXE
```bash
npm run build -w frontend
npm run build -w desktop
```
> Ensure frontend/backend services are bundled or hosted before installer packaging in production.

## Features
- JWT authentication + bcrypt
- Roles/users + basic audit-ready entities
- Customers, products, invoices, returns, payments
- Invoice/return posting with stock and customer balance movement
- Reports APIs + Excel/PDF export endpoints
- Arabic RTL default + language switch saved in localStorage

