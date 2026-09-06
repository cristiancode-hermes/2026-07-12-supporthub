# SupportHub — Architecture

## Overview

SupportHub is a multi-tenant customer support ticket management system. It follows a monorepo structure with a NestJS backend API and an Angular 22 frontend.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (standalone, signals, zoneless, lazy-loaded routes) |
| Backend | NestJS 11 (modules, guards, Swagger) |
| Database | SQLite (dev), Neon PostgreSQL (prod) — configurable via DATABASE_TYPE |
| Styling | Tailwind CSS v4 |
| Auth | JWT (7-day expiry) with organization-scoped multi-tenancy |

## Project Structure

```
/opt/data/2026-07-12-supporthub/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/           # Auth module (JWT register/login, guard)
│   │   │   ├── organizations/  # Organizations module (entity, service)
│   │   │   ├── customers/      # Customers CRUD module
│   │   │   ├── tickets/        # Tickets CRUD + filtering module
│   │   │   ├── dashboard/      # Dashboard stats aggregation
│   │   │   ├── seed/           # Seed data service (run with SEED_DB=true)
│   │   │   ├── app.module.ts   # Root module with TypeORM + feature modules
│   │   │   └── main.ts         # Bootstrap + Swagger + CORS + ValidationPipe
│   │   ├── data/               # SQLite database files
│   │   └── .env                # Local environment config
│   └── web/                    # Angular 22 frontend
│       └── src/app/
│           ├── models/         # TypeScript interfaces
│           ├── services/       # API service (HTTP client)
│           └── pages/          # Lazy-loaded page components
│               ├── login/
│               ├── dashboard/
│               └── tickets/
└── docs/                       # Documentation
```

## Architecture Decisions

### Multi-Tenancy
- Every entity (User, Customer, Ticket) has an `organizationId` foreign key
- JWT payload includes `organizationId` for org-scoped queries
- All service methods filter by organizationId from the authenticated user
- Registration auto-creates an organization if slug doesn't exist

### Authentication
- SHA-256 password hashing (no bcrypt dependency)
- JWT tokens with 7-day expiry
- Passport.js JWT strategy extracts user from Bearer token
- `@UseGuards(JwtAuthGuard)` on protected routes

### Database Switching
- TypeORM config reads `DATABASE_TYPE` env var
- `better-sqlite3` for local development
- `postgres` with SSL for Neon production
- `synchronize: true` for dev (migrations in production)

### Frontend Architecture
- Standalone components with zoneless change detection
- Lazy-loaded routes via `loadComponent()`
- Signals for reactive state (token, tickets, stats)
- Auth guard redirects unauthenticated users to /login
