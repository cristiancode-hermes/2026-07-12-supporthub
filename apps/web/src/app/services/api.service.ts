import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, DashboardStats, Ticket, Customer } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';
  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly isAuthenticated = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.isAuthenticated.set(!!this.token());
  }

  private get headers(): HttpHeaders {
    const t = this.token();
    let h = new HttpHeaders();
    if (t) {
      h = h.set('Authorization', `Bearer ${t}`);
    }
    return h;
  }

  // Auth
  register(data: { email: string; name: string; password: string; organizationName: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(res => this.setToken(res.token))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  private setToken(t: string): void {
    localStorage.setItem('token', t);
    this.token.set(t);
    this.isAuthenticated.set(true);
  }

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`, { headers: this.headers });
  }

  // Tickets
  getTickets(filter?: { status?: string; priority?: string }): Observable<Ticket[]> {
    const params: any = {};
    if (filter?.status) params.status = filter.status;
    if (filter?.priority) params.priority = filter.priority;
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, { headers: this.headers, params });
  }

  getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`, { headers: this.headers });
  }

  createTicket(data: { title: string; description: string; priority: string; customerId: number }): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, data, { headers: this.headers });
  }

  updateTicket(id: number, data: any): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, data, { headers: this.headers });
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tickets/${id}`, { headers: this.headers });
  }

  // Customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`, { headers: this.headers });
  }

  createCustomer(data: { name: string; email: string; phone?: string }): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, data, { headers: this.headers });
  }
}
