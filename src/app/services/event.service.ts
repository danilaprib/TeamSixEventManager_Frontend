import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/events';

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, eventData, this.getAuthOptions());
  }

  likeEvent(id: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${id}/like`, {}, this.getAuthOptions());
  }

  private getAuthOptions() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}
