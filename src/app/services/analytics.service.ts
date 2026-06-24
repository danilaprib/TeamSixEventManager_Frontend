import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, forkJoin, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://teamsixeventmanager-backend-develop.onrender.com/api/events';

  getAnalytics(id: string) {
    const options = this.getAuthOptions();

    return this.http.get<any>(`${this.baseUrl}/${id}/analytics`, options).pipe(
      map((analytics) => this.normalizeAnalyticsResponse(id, analytics)),
      catchError(() => this.getFallbackAnalytics(id))
    );
  }

  private getFallbackAnalytics(id: string) {
    const options = this.getAuthOptions();

    return forkJoin({
      event: this.http.get<any>(`${this.baseUrl}/${id}`, options),
      comments: this.http.get<any[]>(`${this.baseUrl}/${id}/comments`, options).pipe(catchError(() => of([])))
    }).pipe(
      map(({ event, comments }) => this.buildAnalyticsFromEventAndComments(id, event, comments))
    );
  }

  private normalizeAnalyticsResponse(id: string, analytics: any) {
    return {
      id: analytics.id || analytics.eventId || analytics.EventId || id,
      eventTitle: analytics.eventTitle || analytics.EventTitle || analytics.title || analytics.Title || 'Event',
      totalLikes: analytics.totalLikes ?? analytics.TotalLikes ?? analytics.likesCount ?? analytics.LikesCount ?? 0,
      totalAttendees: analytics.totalAttendees ?? analytics.TotalAttendees ?? analytics.attendeesCount ?? analytics.AttendeesCount ?? 0,
      totalComments: analytics.totalComments ?? analytics.TotalComments ?? analytics.commentsCount ?? analytics.CommentsCount ?? 0,
      commentsPerDay: this.normalizeCommentsPerDay(analytics.commentsPerDay || analytics.CommentsPerDay || [])
    };
  }

  private buildAnalyticsFromEventAndComments(id: string, event: any, comments: any[]) {
    const likes = event.EventLikes || event.eventLikes || event.Likes || event.likes || [];
    const attendees = event.EventAttendees || event.eventAttendees || event.Attendees || event.attendees || [];

    return {
      id,
      eventTitle: event.Title || event.title || 'Event',
      totalLikes: Array.isArray(likes) ? likes.length : (event.likesCount || event.LikesCount || 0),
      totalAttendees: Array.isArray(attendees) ? attendees.length : (event.attendeesCount || event.AttendeesCount || 0),
      totalComments: comments.length,
      commentsPerDay: this.groupCommentsByDay(comments)
    };
  }

  private normalizeCommentsPerDay(commentsPerDay: any[]) {
    return commentsPerDay.map((item: any) => ({
      date: item.date || item.Date || item.day || item.Day,
      count: item.count ?? item.Count ?? item.total ?? item.Total ?? 0
    }));
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
