export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  organizationId: number;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  organizationId: number;
  createdAt: string;
}

export type TicketStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerId: number;
  customer?: Customer;
  assignedToId: number | null;
  createdById: number;
  organizationId: number;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgress: number;
  resolvedTickets: number;
  urgentTickets: number;
  totalCustomers: number;
  avgResolutionHours: number;
  byStatus: { status: string; count: number }[];
  byPriority: { priority: string; count: number }[];
}
