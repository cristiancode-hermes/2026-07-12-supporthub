import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="animate-fade-in-up">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1>Dashboard</h1>
          <p class="text-surface-500 text-sm mt-1">Overview of your support operations</p>
        </div>
      </div>

      <!-- KPI Grid - Asymmetric -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger">
        <!-- Total Tickets - Tall card -->
        <div class="card card-md flex flex-col justify-between row-span-1 lg:row-span-2 bg-gradient-to-br from-brand-600 to-brand-700 text-white border-0">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-70"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <p class="text-sm font-medium opacity-80">Total Tickets</p>
          </div>
          <p class="text-4xl font-bold tracking-tight font-mono">{{ stats()?.totalTickets ?? 0 }}</p>
        </div>

        <!-- Open -->
        <div class="card card-md">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-surface-500 font-medium">Open</p>
            <span class="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-warning"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            </span>
          </div>
          <p class="text-3xl font-bold font-mono text-warning">{{ stats()?.openTickets ?? 0 }}</p>
        </div>

        <!-- In Progress -->
        <div class="card card-md">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-surface-500 font-medium">In Progress</p>
            <span class="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-info"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
          </div>
          <p class="text-3xl font-bold font-mono text-info">{{ stats()?.inProgress ?? 0 }}</p>
        </div>

        <!-- Urgent -->
        <div class="card card-md">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-surface-500 font-medium">Urgent</p>
            <span class="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-danger"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </span>
          </div>
          <p class="text-3xl font-bold font-mono text-danger">{{ stats()?.urgentTickets ?? 0 }}</p>
        </div>

        <!-- Resolved (spans 2 cols) -->
        <div class="card card-md col-span-2">
          <div class="flex items-center justify-between mb-3">
            <p class="text-sm text-surface-500 font-medium">Resolved</p>
            <span class="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-success"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
          <p class="text-3xl font-bold font-mono text-success">{{ stats()?.resolvedTickets ?? 0 }}</p>
        </div>

        <!-- Customers + Avg Resolution side by side -->
        <div class="card card-md">
          <p class="text-sm text-surface-500 mb-1">Customers</p>
          <p class="text-3xl font-bold font-mono">{{ stats()?.totalCustomers ?? 0 }}</p>
        </div>

        <div class="card card-md">
          <p class="text-sm text-surface-500 mb-1">Avg Resolution</p>
          <p class="text-2xl font-bold font-mono">{{ stats()?.avgResolutionHours ?? 0 }} <span class="text-sm font-normal text-surface-400">hrs</span></p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Status Distribution -->
        <div class="card card-lg">
          <h2 class="text-base font-semibold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-500"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            By Status
          </h2>
          <div class="space-y-3">
            @for (item of stats()?.byStatus ?? []; track item.status) {
              <div class="flex items-center justify-between">
                <span class="text-sm capitalize text-surface-600 dark:text-surface-300">{{ item.status.replace('_', ' ') }}</span>
                <div class="flex items-center gap-3">
                  <div class="w-32 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full"
                      [style.width.%]="barPercent(item.count, stats()?.totalTickets)"
                      [class.bg-brand-500]="item.status === 'new'"
                      [class.bg-purple-500]="item.status === 'assigned'"
                      [class.bg-amber-500]="item.status === 'in_progress'"
                      [class.bg-green-500]="item.status === 'resolved'"
                      [class.bg-surface-400]="item.status === 'closed'">
                    </div>
                  </div>
                  <span class="font-mono text-sm text-surface-500 w-8 text-right">{{ item.count }}</span>
                </div>
              </div>
            }
            @if ((stats()?.byStatus?.length ?? 0) === 0) {
              <p class="text-sm text-surface-400 text-center py-4">No data available</p>
            }
          </div>
        </div>

        <!-- Priority Distribution -->
        <div class="card card-lg">
          <h2 class="text-base font-semibold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-brand-500"><line x1="4" y1="21" x2="4" y2="14"/><line x1="9" y1="21" x2="9" y2="10"/><line x1="14" y1="21" x2="14" y2="6"/><line x1="19" y1="21" x2="19" y2="2"/></svg>
            By Priority
          </h2>
          <div class="space-y-3">
            @for (item of stats()?.byPriority ?? []; track item.priority) {
              <div class="flex items-center justify-between">
                <span class="text-sm capitalize text-surface-600 dark:text-surface-300">{{ item.priority }}</span>
                <div class="flex items-center gap-3">
                  <div class="w-32 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                    <div class="h-full rounded-full"
                      [style.width.%]="barPercent(item.count, stats()?.totalTickets)"
                      [class.bg-surface-400]="item.priority === 'low'"
                      [class.bg-blue-500]="item.priority === 'medium'"
                      [class.bg-orange-500]="item.priority === 'high'"
                      [class.bg-red-500]="item.priority === 'urgent'">
                    </div>
                  </div>
                  <span class="font-mono text-sm text-surface-500 w-8 text-right">{{ item.count }}</span>
                </div>
              </div>
            }
            @if ((stats()?.byPriority?.length ?? 0) === 0) {
              <p class="text-sm text-surface-400 text-center py-4">No data available</p>
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  protected readonly stats = signal<DashboardStats | null>(null);

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe(s => this.stats.set(s));
  }

  protected barPercent(count: number, total?: number): number {
    if (!total || total === 0) return 0;
    return Math.round((count / total) * 100);
  }
}
