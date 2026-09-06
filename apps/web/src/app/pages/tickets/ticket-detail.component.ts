import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Ticket } from '../../models/types';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [DatePipe, FormsModule, RouterLink],
  template: `
    <div class="animate-fade-in-up">
      @if (loading()) {
        <div class="card card-lg max-w-3xl">
          <div class="skeleton h-8 w-1/2 mb-4"></div>
          <div class="skeleton h-4 w-full mb-2"></div>
          <div class="skeleton h-4 w-3/4 mb-6"></div>
          <div class="flex gap-2">
            <div class="skeleton h-8 w-20"></div>
            <div class="skeleton h-8 w-20"></div>
          </div>
        </div>
      } @else if (ticket()) {
        <div class="max-w-3xl">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-sm text-surface-400 mb-6">
            <a routerLink="/tickets" class="hover:text-brand-500 transition-colors">Tickets</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span class="text-surface-600 dark:text-surface-300 font-mono">#{{ ticket()!.id }}</span>
          </div>

          <div class="card card-lg">
            <!-- Header -->
            <div class="flex items-start justify-between mb-5">
              <div class="flex-1 min-w-0">
                <h1 class="text-xl font-bold mb-2">{{ ticket()!.title }}</h1>
                <div class="flex flex-wrap gap-2">
                  <span [class]="'badge-' + ticket()!.status + ' text-xs'">{{ ticket()!.status.replace('_', ' ') }}</span>
                  <span [class]="'badge-' + ticket()!.priority + ' text-xs'">{{ ticket()!.priority }}</span>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-surface-50 dark:bg-surface-900/50 rounded-lg p-4 mb-6">
              <p class="text-surface-700 dark:text-surface-300 leading-relaxed">{{ ticket()!.description }}</p>
            </div>

            <!-- Meta Grid -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              @if (ticket()!.customer) {
                <div class="card-sm bg-surface-50 dark:bg-surface-900/30">
                  <p class="text-xs text-surface-500 mb-1">Customer</p>
                  <p class="text-sm font-medium truncate">{{ ticket()!.customer!.name }}</p>
                  <p class="text-xs text-surface-400 truncate">{{ ticket()!.customer!.email }}</p>
                </div>
              }
              <div class="card-sm bg-surface-50 dark:bg-surface-900/30">
                <p class="text-xs text-surface-500 mb-1">Created</p>
                <p class="text-sm font-medium font-mono">{{ ticket()!.createdAt | date:'MMM d, y' }}</p>
              </div>
              <div class="card-sm bg-surface-50 dark:bg-surface-900/30">
                <p class="text-xs text-surface-500 mb-1">Updated</p>
                <p class="text-sm font-medium font-mono">{{ ticket()!.updatedAt | date:'MMM d, y' }}</p>
              </div>
              @if (ticket()!.closedAt) {
                <div class="card-sm bg-surface-50 dark:bg-surface-900/30">
                  <p class="text-xs text-surface-500 mb-1">Closed</p>
                  <p class="text-sm font-medium font-mono">{{ ticket()!.closedAt | date:'MMM d, y' }}</p>
                </div>
              }
            </div>

            <!-- Timeline Status -->
            <div class="border-t border-surface-200 dark:border-surface-700 pt-5">
              <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Update Status
              </h3>
              <div class="flex flex-wrap gap-2">
                @for (s of availableStatuses; track s) {
                  <button (click)="updateStatus(s)"
                    class="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200"
                    [class.btn-primary]="ticket()!.status === s"
                    [class.bg-surface-100]="ticket()!.status !== s"
                    [class.dark:bg-surface-800]="ticket()!.status !== s"
                    [class.text-surface-600]="ticket()!.status !== s"
                    [class.hover:bg-surface-200]="ticket()!.status !== s"
                    [class.dark:hover:bg-surface-700]="ticket()!.status !== s">
                    {{ s.replace('_', ' ') }}
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  host: { 'ngSkipHydration': '' } as any
})
export class TicketDetailComponent implements OnInit {
  protected readonly ticket = signal<Ticket | null>(null);
  protected readonly loading = signal(true);
  protected availableStatuses = ['new', 'assigned', 'in_progress', 'resolved', 'closed'];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getTicket(id).subscribe({
      next: (t) => { this.ticket.set(t); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  updateStatus(status: string): void {
    const id = this.ticket()!.id;
    this.api.updateTicket(id, { status }).subscribe(t => this.ticket.set(t));
  }
}
