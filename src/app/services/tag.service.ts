import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  getAllTags() {
    return this.http.get<any[]>('https://teamsixeventmanager-backend-develop.onrender.com/api/tags');
  }
}