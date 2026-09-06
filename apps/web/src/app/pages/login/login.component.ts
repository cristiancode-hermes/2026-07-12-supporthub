import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex">
      <!-- Brand Panel -->
      <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle at 25% 50%, white 0%, transparent 50%), radial-gradient(circle at 75% 50%, white 0%, transparent 50%);"></div>
        <div class="text-center relative z-10 px-12 max-w-md">
          <h1 class="text-5xl font-bold text-white tracking-tight mb-4" style="font-family: var(--font-heading);">
            SupportHub
          </h1>
          <p class="text-brand-200 text-lg leading-relaxed">
            Multi-tenant ticket management platform designed for precision and scale.
          </p>
          <div class="mt-8 flex justify-center gap-2">
            <span class="w-2 h-2 rounded-full bg-white/40"></span>
            <span class="w-2 h-2 rounded-full bg-white/60"></span>
            <span class="w-2 h-2 rounded-full bg-white/80"></span>
          </div>
        </div>
      </div>

      <!-- Form Panel -->
      <div class="w-full lg:w-1/2 flex items-center justify-center px-6 bg-surface-50 dark:bg-surface-950">
        <div class="w-full max-w-sm animate-fade-in-up">
          <div class="text-center lg:hidden mb-8">
            <h1 class="text-3xl font-bold text-brand-600" style="font-family: var(--font-heading);">SupportHub</h1>
            <p class="text-surface-500 mt-1 text-sm">Multi-tenant ticket management</p>
          </div>

          <div class="card card-lg">
            <h2 class="text-xl font-semibold mb-6">{{ isRegister() ? 'Create Account' : 'Sign In' }}</h2>

            @if (error()) {
              <div class="animate-shake bg-danger/10 text-danger px-4 py-3 rounded-lg mb-4 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                {{ error() }}
              </div>
            }

            <form (ngSubmit)="onSubmit()" class="space-y-4">
              @if (isRegister()) {
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Name</label>
                  <input [(ngModel)]="name" name="name" required placeholder="Your name"
                    class="input">
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Organization</label>
                  <input [(ngModel)]="orgName" name="orgName" required placeholder="Company name"
                    class="input">
                </div>
              }
              <div>
                <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Email</label>
                <input [(ngModel)]="email" name="email" type="email" required placeholder="you@company.com"
                  class="input">
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-surface-700 dark:text-surface-300">Password</label>
                <input [(ngModel)]="password" name="password" type="password" required placeholder="••••••••"
                  class="input">
              </div>
              <button type="submit" [disabled]="loading()"
                class="btn-primary w-full py-2.5">
                @if (loading()) {
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Processing...
                } @else {
                  {{ isRegister() ? 'Create Account' : 'Sign In' }}
                }
              </button>
            </form>

            <p class="text-center text-sm text-surface-500 mt-5">
              {{ isRegister() ? 'Already have an account?' : "Don't have an account?" }}
              <button (click)="toggleMode()" class="link font-medium">
                {{ isRegister() ? 'Sign In' : 'Register' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  protected readonly isRegister = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected email = '';
  protected password = '';
  protected name = '';
  protected orgName = '';

  constructor(private api: ApiService, private router: Router) {}

  toggleMode(): void {
    this.isRegister.set(!this.isRegister());
    this.error.set('');
  }

  async onSubmit(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      if (this.isRegister()) {
        await this.api.register({ email: this.email, name: this.name, password: this.password, organizationName: this.orgName }).toPromise();
      } else {
        await this.api.login({ email: this.email, password: this.password }).toPromise();
      }
      this.router.navigate(['/dashboard']);
    } catch (e: any) {
      this.error.set(e.error?.message || 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
