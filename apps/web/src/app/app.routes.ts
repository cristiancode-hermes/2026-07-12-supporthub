import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './services/api.service';

export const authGuard = () => {
  const api = inject(ApiService);
  const router = inject(Router);
  if (!api.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'tickets', loadComponent: () => import('./pages/tickets/tickets.component').then(m => m.TicketsComponent), canActivate: [authGuard] },
  { path: 'tickets/new', loadComponent: () => import('./pages/tickets/ticket-form.component').then(m => m.TicketFormComponent), canActivate: [authGuard] },
  { path: 'tickets/:id', loadComponent: () => import('./pages/tickets/ticket-detail.component').then(m => m.TicketDetailComponent), canActivate: [authGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
