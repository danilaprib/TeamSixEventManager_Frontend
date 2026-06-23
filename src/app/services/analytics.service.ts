import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/events';

  getAnalytics(id: string) {
    const options = this.getAuthOptions();

    return forkJoin({
      event: this.http.get<any>(`${this.baseUrl}/${id}`, options),
      comments: this.http.get<any[]>(`${this.baseUrl}/${id}/comments`, options).pipe(catchError(() => of([])))
    }).pipe(
      map(({ event, comments }) => {
        const likes = event.EventLikes || event.eventLikes || [];
        const attendees = event.EventAttendees || event.eventAttendees || [];

        return {
          id,
          eventTitle: event.Title || event.title || 'Event',
          totalLikes: Array.isArray(likes) ? likes.length : (event.likes || event.likesCount || 0),
          totalAttendees: Array.isArray(attendees) ? attendees.length : (event.attendees || event.attendeesCount || 0),
          totalComments: comments.length,
          commentsPerDay: this.groupCommentsByDay(comments)
        };
      })
    );
  }

  private groupCommentsByDay(comments: any[]) {
    const countsByDate = comments.reduce((acc: Record<string, { date: string; count: number; timestamp: number }>, comment: any) => {
      const createdAt = comment.createdAt || comment.CreatedAt || comment.created_at;

      if (!createdAt) {
        return acc;
      }

      const parsedDate = new Date(createdAt);
      const key = parsedDate.toISOString().split('T')[0];
      const date = parsedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      acc[key] = acc[key] || { date, count: 0, timestamp: parsedDate.getTime() };
      acc[key].count += 1;
      return acc;
    }, {});

    return Object.values(countsByDate)
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(({ date, count }) => ({ date, count }));
  }

  private getAuthOptions() {
    const token = localStorage.getItem('token');
    return token
      ? { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      : {};
  }
}
