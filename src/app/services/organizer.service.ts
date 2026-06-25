import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizerService {

  private http = inject(HttpClient);
  private organizerRequestsUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/organizer-requests';
  public auth = inject(AuthService);

  getOrganizerRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.organizerRequestsUrl, this.auth.getAuthOptions());
  }

  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.organizerRequestsUrl}/me`, this.auth.getAuthOptions());
  }

  submitRequest(reason: string): Observable<any> {
    return this.http.post(this.organizerRequestsUrl, { reason }, this.auth.getAuthOptions());
  }

  approveRequest(userId: string) { return this.http.post(`${this.organizerRequestsUrl}/${userId}/approve`, {}, this.auth.getAuthOptions()); }

  disapproveRequest(userId: string) { return this.http.post(`${this.organizerRequestsUrl}/${userId}/disapprove`, {}, this.auth.getAuthOptions()); }

}
