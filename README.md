# STUDIO Sales Management (Arabic RTL)

نظام إدارة مبيعات متكامل (Backend + Frontend + Desktop Electron).

## Stack
- Backend: Node.js + Express + Prisma + SQLite/PostgreSQL + JWT + Zod
- Frontend: React (Vite) + Tailwind + i18next (RTL)
- Desktop: Electron + electron-builder
- Reports: ExcelJS + PDFKit

## Project Structure
- `backend/`
- `frontend/`
- `desktop/`
- `docs/`

## 1) Backend Setup
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### Default Admin
- username: `admin`
- password: `Admin@123`

Swagger:
- `http://localhost:4000/api/docs`

## 2) Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Env optional:
```bash
VITE_API_URL=http://localhost:4000/api
```

## 3) Desktop (Electron)
```bash
cd desktop
npm install
npm run dev
```

Windows EXE build:
```bash
npm run build
```

## Production Build
1. Build frontend
```bash
cd frontend && npm run build
```
2. Deploy backend
```bash
cd backend && npm ci && npx prisma migrate deploy && npm run start
```
3. Package desktop
```bash
cd desktop && npm run build
```

## Key Features Implemented
- Authentication (login/refresh/logout)
- Customers / Products / Invoices / Returns / Payments APIs
- Invoice posting transaction (stock deduction + balance update)
- Return posting transaction (restock + balance reduction)
- Arabic invoice PDF generation endpoint
- Sales report + Excel export endpoint
- Dashboard metrics
- Arabic RTL frontend with language switcher and localStorage persistence

## Notes
- Database provider selectable via `.env`:
  - SQLite: `DATABASE_PROVIDER=sqlite`
  - PostgreSQL: `DATABASE_PROVIDER=postgresql`
- For PostgreSQL set appropriate `DATABASE_URL`.
