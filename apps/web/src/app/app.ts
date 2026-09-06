import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    @if (api.isAuthenticated()) {
      <!-- Navigation -->
      <nav class="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-8">
              <a routerLink="/dashboard" class="text-lg font-bold text-brand-600">SupportHub</a>
              <div class="flex items-center gap-4">
                <a routerLink="/dashboard" routerLinkActive="text-brand-600 font-semibold"
                  class="text-sm text-surface-600 dark:text-surface-300 hover:text-brand-600 transition-colors">Dashboard</a>
                <a routerLink="/tickets" routerLinkActive="text-brand-600 font-semibold"
                  class="text-sm text-surface-600 dark:text-surface-300 hover:text-brand-600 transition-colors">Tickets</a>
              </div>
            </div>
            <button (click)="api.logout()" class="text-sm text-surface-500 hover:text-danger transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <router-outlet />
      </main>
    } @else {
      <router-outlet />
    }
  `
})
export class App {
  constructor(protected api: ApiService) {}
}
