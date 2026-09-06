# SupportHub Frontend

## Overview

Angular 22 standalone, zoneless frontend with lazy-loaded pages and signal-based state management.

## Tech Stack

- **Angular 22** with standalone components, zoneless change detection
- **Tailwind CSS v4** for styling (`@import "tailwindcss"` in styles.css)
- **Lazy loading** via `loadComponent()` in routes
- **Signals** for reactive state (`signal()`, `computed()`)
- **HttpClient** with `withFetch()` for HTTP

## Project Structure

```
src/app/
├── models/
│   └── types.ts           # TypeScript interfaces (Ticket, Customer, etc.)
├── services/
│   └── api.service.ts     # Centralized HTTP service with JWT header management
└── pages/
    ├── login/
    │   └── login.component.ts    # Login/Register page
    ├── dashboard/
    │   └── dashboard.component.ts # KPI dashboard
    └── tickets/
        ├── tickets.component.ts      # Ticket list with filters
        ├── ticket-detail.component.ts # Single ticket view + status update
        └── ticket-form.component.ts   # Create new ticket
```

## Routes

| Path | Component | Auth | Description |
|------|-----------|------|-------------|
| /login | LoginComponent | No | Login and registration |
| /dashboard | DashboardComponent | Yes | KPI dashboard |
| /tickets | TicketsComponent | Yes | Ticket list with filters |
| /tickets/new | TicketFormComponent | Yes | Create ticket |
| /tickets/:id | TicketDetailComponent | Yes | View/update ticket |

## Key Patterns

### Auth Guard
```typescript
export const authGuard = () => {
  if (!api.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
```

### Signal-Based State
```typescript
protected readonly tickets = signal<Ticket[]>([]);
protected readonly loading = signal(true);
```

### API Service
- Centralized `HttpHeaders` management with JWT token
- Token stored in `localStorage` and a `signal` for reactivity
- `isAuthenticated()` signal used by auth guard and app layout

### Tailwind Theme
- Brand colors (indigo): `--color-brand-50` through `--color-brand-950`
- Surface colors (slate): `--color-surface-50` through `--color-surface-950`
- Semantic: `--color-success`, `--color-warning`, `--color-danger`, `--color-info`
- Dark mode via `.dark` class on `<html>`

## Build

```bash
cd apps/web

# Pre-process Tailwind v4 CSS (required for production build)
npx @tailwindcss/cli -i src/styles.css -o /tmp/tw-out.css && cp /tmp/tw-out.css src/styles.css

# Build
./node_modules/.bin/ng build
```

Deploy output goes to `apps/web/dist/web/browser/`.
