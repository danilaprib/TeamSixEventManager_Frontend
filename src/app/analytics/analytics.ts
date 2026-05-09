import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

import { 
  NgApexchartsModule, 
  ApexChart, 
  ApexXAxis, 
  ApexPlotOptions, 
  ApexAxisChartSeries 
} from 'ng-apexcharts';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [NgApexchartsModule, RouterLink],
  templateUrl: './analytics.html',
})
export class Analytics {
  public viewsChartOptions: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    colors: string[];
    plotOptions: ApexPlotOptions;
  } = {
    series: [{
      name: "Views",
      data: [580, 720, 680, 760, 850, 510, 400]
    }],
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#28a745'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
      }
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    }
  };
}