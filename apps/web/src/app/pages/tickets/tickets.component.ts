import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Ticket } from '../../models/types';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  template: `
    <div class="animate-fade-in-up">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1>Tickets</h1>
          <p class="text-surface-500 text-sm mt-1">Manage and track support requests</p>
        </div>
        <a routerLink="/tickets/new" class="btn-primary px-4 py-2 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Ticket
        </a>
      </div>

      <!-- Filters -->
      <div class="flex gap-2 mb-6 flex-wrap">
        <div class="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1 gap-0.5">
          @for (s of statusOptions; track s.value) {
            <button (click)="statusFilter = s.value; loadTickets()"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              [class.bg-white]="statusFilter === s.value"
              [class.dark:bg-surface-700]="statusFilter === s.value"
              [class.text-brand-600]="statusFilter === s.value"
              [class.shadow-sm]="statusFilter === s.value"
              [class.text-surface-500]="statusFilter !== s.value"
              [class.hover:text-surface-700]="statusFilter !== s.value">
              {{ s.label }}
            </button>
          }
        </div>

        <div class="flex bg-surface-100 dark:bg-surface-800 rounded-lg p-1 gap-0.5">
          @for (p of priorityOptions; track p.value) {
            <button (click)="priorityFilter = p.value; loadTickets()"
              class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200"
              [class.bg-white]="priorityFilter === p.value"
              [class.dark:bg-surface-700]="priorityFilter === p.value"
              [class.text-brand-600]="priorityFilter === p.value"
              [class.shadow-sm]="priorityFilter === p.value"
              [class.text-surface-500]="priorityFilter !== p.value"
              [class.hover:text-surface-700]="priorityFilter !== p.value">
              {{ p.label }}
            </button>
          }
        </div>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="card card-md">
              <div class="skeleton h-5 w-3/4 mb-3"></div>
              <div class="skeleton h-3 w-full mb-2"></div>
              <div class="flex gap-2">
                <div class="skeleton h-5 w-16"></div>
                <div class="skeleton h-5 w-16"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Ticket List -->
      @if (!loading()) {
        <div class="space-y-2 stagger">
          @for (ticket of tickets(); track ticket.id) {
            <a [routerLink]="['/tickets', ticket.id]"
              class="block card card-sm hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-200"
              [class.border-l-4]="false">

              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-mono text-surface-400">#{{ ticket.id }}</span>
                    <h3 class="font-semibold truncate">{{ ticket.title }}</h3>
                  </div>
                  <p class="text-sm text-surface-500 line-clamp-1">{{ ticket.description }}</p>
                  <div class="flex items-center gap-2 mt-2">
                    <span [class]="'badge-' + ticket.status">{{ ticket.status.replace('_', ' ') }}</span>
                    <span [class]="'badge-' + ticket.priority">{{ ticket.priority }}</span>
                    @if (ticket.customer) {
                      <span class="text-xs text-surface-400 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ ticket.customer.name }}
                      </span>
                    }
                  </div>
                </div>
                <span class="text-xs text-surface-400 whitespace-nowrap font-mono">{{ ticket.createdAt | date:'MMM d' }}</span>
              </div>
            </a>
          } @empty {
            <div class="card card-lg text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-surface-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <h3 class="text-lg font-semibold text-surface-600 dark:text-surface-300 mb-1">No tickets found</h3>
              <p class="text-sm text-surface-400 mb-4">Get started by creating your first support ticket</p>
              <a routerLink="/tickets/new" class="btn-primary px-4 py-2 inline-flex">Create Ticket</a>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class TicketsComponent implements OnInit {
  protected readonly tickets = signal<Ticket[]>([]);
  protected readonly loading = signal(true);
  protected statusFilter = '';
  protected priorityFilter = '';

  protected statusOptions = [
    { value: '', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  protected priorityOptions = [
    { value: '', label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading.set(true);
    const filter: any = {};
    if (this.statusFilter) filter.status = this.statusFilter;
    if (this.priorityFilter) filter.priority = this.priorityFilter;
    this.api.getTickets(filter).subscribe({
      next: (t) => { this.tickets.set(t); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
