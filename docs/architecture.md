# Architecture Notes
- Backend follows Controller/Service style with Prisma repository access.
- Invoice posting uses Prisma transactions to ensure stock and balance consistency.
- Soft-delete enabled via `deletedAt` on main entities.
- Frontend is modular page-based with reusable DataTable and i18next dictionaries.
