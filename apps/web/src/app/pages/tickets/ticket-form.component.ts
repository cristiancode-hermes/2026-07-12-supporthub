import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Customer } from '../../models/types';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="animate-fade-in-up">
      <div class="max-w-2xl mx-auto">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-surface-400 mb-6">
          <a routerLink="/tickets" class="hover:text-brand-500 transition-colors">Tickets</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          <span class="text-surface-600 dark:text-surface-300">New Ticket</span>
        </div>

        <div class="card card-lg">
          <h1 class="text-xl font-bold mb-1">New Ticket</h1>
          <p class="text-sm text-surface-500 mb-6">Create a new support request</p>

          @if (error()) {
            <div class="animate-shake bg-danger/10 text-danger px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Title</label>
              <input [(ngModel)]="title" name="title" required placeholder="Brief description of the issue"
                class="input">
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Description</label>
              <textarea [(ngModel)]="description" name="description" rows="4" required placeholder="Detailed explanation of the problem"
                class="input resize-y min-h-[100px]"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Priority</label>
              <select [(ngModel)]="priority" name="priority" class="select">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Customer</label>
              <select [(ngModel)]="customerId" name="customerId" required class="select">
                <option value="">Select a customer...</option>
                @for (c of customers(); track c.id) {
                  <option [value]="c.id">{{ c.name }} — {{ c.email }}</option>
                }
              </select>
            </div>
            <div class="flex items-center gap-3 pt-2">
              <button type="submit" [disabled]="loading()"
                class="btn-primary px-6 py-2.5 gap-2">
                @if (loading()) {
                  <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {{ loading() ? 'Creating...' : 'Create Ticket' }}
                } @else {
                  Create Ticket
                }
              </button>
              <a routerLink="/tickets" class="btn-ghost px-4 py-2">Cancel</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class TicketFormComponent implements OnInit {
  protected readonly customers = signal<Customer[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected title = '';
  protected description = '';
  protected priority = 'medium';
  protected customerId = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getCustomers().subscribe(c => this.customers.set(c));
  }

  async onSubmit(): Promise<void> {
    if (!this.title || !this.description || !this.customerId) {
      this.error.set('Please fill all required fields');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const ticket = await this.api.createTicket({
        title: this.title,
        description: this.description,
        priority: this.priority,
        customerId: Number(this.customerId),
      }).toPromise();
      this.router.navigate(['/tickets', ticket!.id]);
    } catch (e: any) {
      this.error.set(e.error?.message || 'Failed to create ticket');
    } finally {
      this.loading.set(false);
    }
  }
}
