# SupportHub API

Base URL: `http://localhost:3000/api`
Swagger Docs: `http://localhost:3000/api/docs`

## Authentication

All protected endpoints require a Bearer JWT token:
```
Authorization: Bearer <token>
```

### POST /auth/register
Creates a new organization and admin user.

**Body:**
```json
{
  "email": "admin@acme.com",
  "name": "Admin User",
  "password": "password123",
  "organizationName": "Acme Corp"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": { "id": 1, "email": "admin@acme.com", "name": "Admin User", "role": "admin", "organizationId": 1 }
}
```

### POST /auth/login
Authenticates existing user.

**Body:**
```json
{
  "email": "admin@acme.com",
  "password": "password123"
}
```

**Response:** Same as register

## Protected Endpoints

### GET /dashboard/stats
Returns aggregated KPIs for the authenticated user's organization.

**Response:**
```json
{
  "totalTickets": 10,
  "openTickets": 4,
  "inProgress": 2,
  "resolvedTickets": 1,
  "urgentTickets": 2,
  "totalCustomers": 5,
  "avgResolutionHours": 36,
  "byStatus": [{"status": "new", "count": 4}],
  "byPriority": [{"priority": "high", "count": 3}]
}
```

### GET /tickets
List tickets with optional filters.

**Query params:** `?status=new&priority=high`

### GET /tickets/:id
Get single ticket with customer relation.

### POST /tickets
Create a new ticket.

```json
{
  "title": "Cannot login to dashboard",
  "description": "User reports error...",
  "priority": "high",
  "customerId": 1
}
```

### PUT /tickets/:id
Update ticket (status, priority, assignment).

```json
{
  "status": "in_progress",
  "assignedToId": 2
}
```

Setting status to `resolved` or `closed` auto-sets `closedAt` timestamp.

### DELETE /tickets/:id
Delete a ticket.

### GET /customers
List customers (org-scoped).

### POST /customers
Create a customer.

```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1-555-0123"
}
```

### PUT /customers/:id
Update customer.

### DELETE /customers/:id
Delete customer.

### GET /organizations
List all organizations (admin).

### POST /organizations
Create organization directly.

## Data Model

### Organization
| Field | Type | Description |
|-------|------|-------------|
| id | number | PK |
| name | string | Organization name |
| slug | string | URL-safe unique identifier |
| createdAt | date | Auto-generated |

### User
| Field | Type | Description |
|-------|------|-------------|
| id | number | PK |
| email | string | Unique email |
| name | string | Display name |
| password | string | SHA-256 hash |
| role | string | 'admin' or 'agent' |
| organizationId | number | FK to Organization |

### Customer
| Field | Type | Description |
|-------|------|-------------|
| id | number | PK |
| name | string | Customer name |
| email | string | Customer email |
| phone | string | Optional phone |
| organizationId | number | FK to Organization |

### Ticket
| Field | Type | Description |
|-------|------|-------------|
| id | number | PK |
| title | string | Short description |
| description | text | Full description |
| status | enum | new, assigned, in_progress, resolved, closed |
| priority | enum | low, medium, high, urgent |
| customerId | number | FK to Customer |
| assignedToId | number | FK to User (nullable) |
| createdById | number | FK to User |
| organizationId | number | FK to Organization |
| closedAt | date | Nullable, set on resolve/close |

## Seed Data

Run with `SEED_DB=true` env var:
```bash
SEED_DB=true npm run start:dev
```

Seeds:
- 2 Organizations (Acme Corp, Globex Inc)
- 2 Users (admin@acme.com/password123, agent@acme.com/password123)
- 5 Customers
- 10 Tickets (mix of statuses and priorities)
