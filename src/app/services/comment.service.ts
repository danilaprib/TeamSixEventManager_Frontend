import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/events';

  getComments(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${id}/comments`);
  }

  addComment(eventId: string, content: string): Observable<any> {
    const options = this.authService['getAuthOptions'](); 
    
    return this.http.post(`${this.baseUrl}/${eventId}/comments`, { content }, options);
  }
}