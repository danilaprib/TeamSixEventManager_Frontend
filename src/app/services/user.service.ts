import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private tagsUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/users/me/tags';

  getMyTags() { return this.http.get<any[]>(this.tagsUrl); }

  updateMyTags(tagIds: number[]) { return this.http.put(this.tagsUrl, tagIds); }

}