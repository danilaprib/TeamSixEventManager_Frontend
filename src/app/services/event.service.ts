import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/events';

  getEvents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  updateEvent(id: string, eventData: any) {
    return this.http.put(`${this.baseUrl}/${id}`, eventData, this.auth.getAuthOptions());
  }

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, eventData, this.getAuthOptions());
  }

  toggleEventLike(eventId: string, isCurrentlyLiked: boolean): Observable<any> {
    const likeUrl = `${this.baseUrl}/${eventId}/like`;

    return isCurrentlyLiked
      ? this.http.delete(likeUrl, this.getAuthOptions())
      : this.http.post(likeUrl, {}, this.getAuthOptions());

  }

  toggleEventAttendance(eventId: string, isCurrentlyAttending: boolean): Observable<any> {

    const attendUrl = `${this.baseUrl}/${eventId}/attend`;

    return isCurrentlyAttending
      ? this.http.delete(attendUrl, this.getAuthOptions())
      : this.http.post(attendUrl, {}, this.getAuthOptions());
  }

  private getAuthOptions() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}