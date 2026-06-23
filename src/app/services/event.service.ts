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

  getEventById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, eventData, this.getAuthOptions());
  }

  toggleEventLike(id: string, isCurrentlyLiked: boolean): Observable<any> {
    const likeUrl = `${this.baseUrl}/${id}/like`;

    // if (isCurrentlyLiked) {
    //   return this.http.delete(likeUrl, this.getAuthOptions());
    // }
    // else {
    //   return this.http.post<any>(likeUrl, { isCurrentlyLiked }, this.getAuthOptions());
    // }

    return isCurrentlyLiked 
    ? this.http.delete(likeUrl, this.getAuthOptions()) 
    : this.http.post(likeUrl, {}, this.getAuthOptions());

  }

  private getAuthOptions() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}
