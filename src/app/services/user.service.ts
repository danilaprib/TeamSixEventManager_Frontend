import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private tagsUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/users/me/tags';
  public authService = inject(AuthService);

  getMyTags() { return this.http.get<any[]>(this.tagsUrl); }

  updateMyTags(tagIds: number[]) { return this.http.put(this.tagsUrl, tagIds); }

  submitOrganizerRequest(reason: string) {
    return this.http.post('https://teamsixeventmanager-backend-develop.onrender.com/api/organizer-requests',
      { reason }, this.authService.getAuthOptions());
  }

  getOrganizerRequestStatus() {
    return this.http.get('https://teamsixeventmanager-backend-develop.onrender.com/api/organizer-requests/me',
      this.authService.getAuthOptions());
  }

getCurrentUserProfile() {
  return this.http.get('https://teamsixeventmanager-backend-develop.onrender.com/api/users/me', 
    this.authService.getAuthOptions());
}
}