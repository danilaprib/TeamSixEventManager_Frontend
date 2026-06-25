import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private adminUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/admin';
  private organizerRequestsUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/organizer-requests';

  getUsers() { return this.http.get<any[]>(`${this.adminUrl}/users`, this.auth.getAuthOptions()); }

  getUserById(userId: string) { return this.http.get<any>(`${this.adminUrl}/users/${userId}`, this.auth.getAuthOptions()); }

  blockUser(userId: string) { return this.http.post(`${this.adminUrl}/block/${userId}`, {}, this.auth.getAuthOptions()); }

  unblockUser(userId: string) { return this.http.post(`${this.adminUrl}/unblock/${userId}`, {}, this.auth.getAuthOptions()); }
}