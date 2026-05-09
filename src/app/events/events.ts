import { Component } from '@angular/core';
import { EventModel } from '../models/event.model';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-events',
  imports: [RouterLink],
  templateUrl: './events.html',
  styles: `
    .btn-green{
      background-color: var(--main-color);
      transition: 0.2s;
    }
    .btn-green:hover{
      background-color: var(--main-color-dark);
    }
    .event-card-img{
      cursor: pointer;
      transition: transform 0.3s ease-in-out;
    }
    .event-card-img:hover {
    transform: scale(1.05); 
  
    filter: brightness(105%);
    z-index: 1; 
    }
  `,
})
export class Events {

  isSortingAscending: Boolean = false;

  events: EventModel[] = [
    {
      id: 1,
      title: 'Basketball Championship',
      date: 'Apr 25, 2026',
      time: '10:00',
      location: 'Vilnius',
      category: 'Sports',
      price: 0,
      imageUrl: 'assets/images/basketball.jpg',
      isInWishlist: true,
      isLiked: false,
      likesCount: 99
    },
    {
      id: 2,
      title: 'Football Match',
      date: 'May 10, 2026',
      time: '12:00',
      location: 'Kaunas',
      category: 'Sports',
      price: 100,
      imageUrl: 'assets/images/football.jpg',
      isInWishlist: false,
      isLiked: true,
      likesCount: 20
    },
  ];


  toggleWishlist(event: EventModel) {

    event.isInWishlist = !event.isInWishlist
  }

  toggleLike(event: EventModel) {
    event.isLiked = !event.isLiked
  }


  toggleSortDirection() {
    this.isSortingAscending = !this.isSortingAscending;

    if (this.isSortingAscending) {
      this.events.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      this.events.sort((a, b) => b.title.localeCompare(a.title));
    }
  }
}
