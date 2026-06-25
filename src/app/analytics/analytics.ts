import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AnalyticsService } from '../services/analytics.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EventService } from '../services/event.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './analytics.html',
})
export class Analytics implements OnInit {
  private eventService = inject(EventService);
  private route = inject(ActivatedRoute);
  private analyticsService = inject(AnalyticsService);
  private cdr = inject(ChangeDetectorRef);

  id: string | null = null;
  analyticsData: any = null;
  errorMessage = '';
  isLoading = true;

  public chartOptions: any = {
    series: [{ name: 'Comments', data: [] }],
    chart: { type: 'bar', height: 300, toolbar: { show: false } },
    colors: ['#28a745'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
    xaxis: { categories: [] },
    noData: { text: 'No comments yet' }
  };

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('eventId') || this.route.snapshot.paramMap.get('id');

    if (!this.id) {
      this.errorMessage = 'Event id is missing.';
      this.isLoading = false;
      return;
    }


    forkJoin({
      analytics: this.analyticsService.getAnalytics(this.id),
      event: this.eventService.getEventById(this.id)
    }).subscribe({
      next: ({ analytics, event }) => {
        this.analyticsData = {
          ...analytics,
          totalLikes: event.likes ?? event.Likes ?? analytics.totalLikes,
          totalAttendees: event.attendees ?? event.Attendees ?? analytics.totalAttendees
        };
        
        this.updateCharts(this.analyticsData);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load data for this event.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // this.analyticsService.getAnalytics(this.id).subscribe({
    //   next: (data) => {
    //     this.analyticsData = data;
    //     this.updateCharts(data);
    //     this.isLoading = false;
    //     this.cdr.detectChanges();
    //   },
    //   error: (err) => {
    //     console.error('Analytics request failed:', err);
    //     this.errorMessage = 'Failed to load analytics for this event.';
    //     this.isLoading = false;
    //     this.cdr.detectChanges();
    //   }
    // });
  }


  updateCharts(data: any) {
    const commentsPerDay = data.commentsPerDay || [];

    this.chartOptions = {
      ...this.chartOptions,
      series: [{
        name: 'Comments',
        data: commentsPerDay.map((day: any) => day.count)
      }],
      xaxis: {
        ...this.chartOptions.xaxis,
        categories: commentsPerDay.map((day: any) => day.date)
      }
    };
  }

}
