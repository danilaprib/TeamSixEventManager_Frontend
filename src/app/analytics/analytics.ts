import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from "@angular/router";
import { AnalyticsService } from '../services/analytics.service';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './analytics.html',
})
export class Analytics implements OnInit {
  private route = inject(ActivatedRoute);
  private analyticsService = inject(AnalyticsService);
  
  id: string | null = null;
  analyticsData: any = null;
  errorMessage = '';

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
      return;
    }

    this.analyticsService.getAnalytics(this.id).subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.updateCharts(data);
      },
      error: (err) => {
        console.error('Failed to load analytics:', err);
        this.errorMessage = 'Failed to load analytics for this event.';
      }
    });


    // console.log(`ANALYTICS: `, this.analyticsData);
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
