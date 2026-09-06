# SupportHub — Multi-Tenant Ticket Management

**Date:** 2026-07-12

A full-stack customer support ticket management system with multi-tenant isolation, built daily as part of the Daily Builder pipeline.

## Features

- **Multi-tenant** — Organization-scoped data with JWT auth
- **Ticket Workflow** — new → assigned → in_progress → resolved → closed
- **Priority Levels** — low, medium, high, urgent
- **Dashboard KPIs** — counts by status/priority, avg resolution time
- **Customer Management** — per-organization customer directory
- **Seed Data** — 2 orgs, 2 users, 5 customers, 10 tickets

## Quick Start

### Backend
```bash
cd apps/api
npm install
cp .env.example .env   # or use defaults
npm run start:dev      # http://localhost:3000/api
npm run start:seed     # With seed data: SEED_DB=true npm run start:dev
```

### Frontend
```bash
cd apps/web
npm install
./node_modules/.bin/ng serve   # http://localhost:4200
```

### Seed Credentials
| Email | Password | Role |
|-------|----------|------|
| admin@acme.com | password123 | Admin |
| agent@acme.com | password123 | Agent |

## Build Pipeline
1. **02:30** — design-specs-builder (creates specs)
2. **03:30** — This builder (creates project)
3. **07:00** — qa-tester-deployer (QA + deployment)

## Stack
- Angular 22 (standalone, signals, zoneless, Tailwind v4)
- NestJS 11 (TypeORM, Passport JWT, Swagger)
- SQLite (dev) / Neon PostgreSQL (prod)
