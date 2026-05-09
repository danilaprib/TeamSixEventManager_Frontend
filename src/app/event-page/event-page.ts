import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-event-page',
  imports: [RouterLink],
  templateUrl: './event-page.html',
  styles: `
    .hover-analytics{
      background-color: var(--main-color);
      transition: 0.2s;
    }
    .hover-analytics:hover{

      background: var(--main-color-dark);
    }
  `,
})
export class EventPageComponent { }
