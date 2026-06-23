import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/auth';
  private usersUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/users';

  currentUserToken = signal<string | null>(localStorage.getItem('token'));
  currentUserRole = signal<string | null>(localStorage.getItem('role'));
  currentUserId = signal<string | null>(null);
  currentUsername = signal<string | null>(null);
  currentUserEmail = signal<string | null>(null);

  constructor() {
    this.decodeTokenData();
  }

  register(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, credentials);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.currentUserToken.set(response.token);
          
          const userRole = response.role || 'User';
          localStorage.setItem('role', userRole);
          this.currentUserRole.set(userRole);

          this.decodeTokenData();
        }
      })
    );
  }



  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${this.usersUrl}/me`, this.getAuthOptions());
  }

  private decodeTokenData() {
    const token = this.currentUserToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUserId.set(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || decoded.nameid || decoded.sub || null);
        this.currentUsername.set(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded.name || 'User');
        this.currentUserEmail.set(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded.email || '');
      } catch (e) {
        console.error('Invalid token found:', e);
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserToken() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUserRole() === role;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.currentUserToken.set(null);
    this.currentUserRole.set(null);
    this.currentUserId.set(null);
    this.currentUsername.set(null);
    this.currentUserEmail.set(null);
  }

  public getAuthOptions() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}
