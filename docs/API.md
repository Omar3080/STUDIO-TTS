# API Overview

Base URL: `/api`

## Auth
- POST `/auth/login`
- POST `/auth/refresh`
- POST `/auth/logout`

## Customers
- GET `/customers`
- POST `/customers`
- PATCH `/customers/:id`
- DELETE `/customers/:id`

## Products
- GET `/products`
- POST `/products`
- PATCH `/products/:id`
- DELETE `/products/:id`

## Invoices
- GET `/invoices`
- POST `/invoices`
- POST `/invoices/:id/post`
- GET `/invoices/:id/pdf`

## Returns
- POST `/returns`
- POST `/returns/:id/post`

## Payments
- GET `/payments`
- POST `/payments`

## Reports
- GET `/reports/sales?from=YYYY-MM-DD&to=YYYY-MM-DD`
- GET `/reports/sales/excel`

## Settings
- GET `/settings`
- PATCH `/settings`
