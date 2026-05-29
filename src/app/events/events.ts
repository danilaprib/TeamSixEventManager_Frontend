import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router, RouteReuseStrategy } from "@angular/router";
import { EventService } from '../services/event.service';



@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './events.html',
  styles: `
    .btn-green {
      background-color: var(--main-color);
      transition: 0.2s;
    }
    .btn-green:hover {
      background-color: var(--main-color-dark);
    }
    .event-card-img {
      cursor: pointer;
      transition: transform 0.3s ease-in-out;
    }
    .event-card-img:hover {
      transform: scale(1.05); 
      filter: brightness(105%);
      z-index: 1; 
    }
  `,

providers: [
    {
      provide: RouteReuseStrategy,
      useValue: {
        shouldDetach: () => false,
        store: () => null,
        retrieve: () => null,
        shouldAttach: () => false,
        shouldReuseRoute: () => false
      }
    }
  ]
})
export class Events implements OnInit {
  private eventService = inject(EventService);
  private router = inject(Router);

  isSortingAscending: boolean = false;
  currentSortType: string = 'date';
  
  allEvents: any[] = [];
  events: any[] = []; 

  ngOnInit() {
    this.eventService.getEvents().subscribe({
      next: (backendData: any[]) => {
        this.events = backendData.map(item => {
          const tagsArray = item.EventTags || item.eventTags;
          const firstTagEntity = tagsArray && tagsArray[0];
          const tagObj = firstTagEntity ? (firstTagEntity.Tag || firstTagEntity.tag) : null;
          const firstTag = tagObj ? (tagObj.Name || tagObj.name || '').toLowerCase() : '';

          let selectedImage = 'assets/images/default.jpg';
          if (firstTag.includes('sport') || firstTag.includes('basketball') || firstTag.includes('football')) {
            selectedImage = 'assets/images/sports.jpg';
          } else if (firstTag.includes('music') || firstTag.includes('concert')) {
            selectedImage = 'assets/images/music.jpg';
          } else if (firstTag.includes('outdoor') || firstTag.includes('nature')) {
            selectedImage = 'assets/images/outdoors.jpg';
          }

          return {
            id: item.Id || item.id,
            title: item.Title || item.title,
            description: item.Description || item.description,
            rawDate: new Date(item.Date || item.date),
            date: new Date(item.Date || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date(item.Date || item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            location: item.Location || item.location || 'Unknown',
            category: firstTag ? firstTag.toUpperCase() : 'EVENT',
            price: item.Price !== undefined ? item.Price : (item.price !== undefined ? item.price : 0),
            imageUrl: selectedImage,
            isLiked: false,
            likesCount: item.EventLikes ? item.EventLikes.length : (item.eventLikes ? item.eventLikes.length : 0)
          };
        });
        
        this.sortEvents();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleSortDirection() {
    this.isSortingAscending = !this.isSortingAscending;
    this.sortEvents();
  }

  setSortType(type: string) {
    this.currentSortType = type;
    this.sortEvents();
  }

  sortEvents() {
    this.events.sort((a, b) => {
      let comparison = 0;

      if (this.currentSortType === 'date') {
        comparison = a.rawDate.getTime() - b.rawDate.getTime();
      } else if (this.currentSortType === 'price') {
        comparison = a.price - b.price;
      } else if (this.currentSortType === 'likes') {
        comparison = a.likesCount - b.likesCount;
      }

      return this.isSortingAscending ? comparison : -comparison;
    });
  }

  toggleLike(event: any, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    mouseEvent.preventDefault();

    const wasLiked = event.isLiked;
    const previousLikesCount = event.likesCount;

    event.isLiked = !wasLiked;
    event.likesCount = wasLiked
      ? Math.max(0, event.likesCount - 1)
      : event.likesCount + 1;

    this.eventService.likeEvent(event.id).subscribe({
      next: () => {
        if (this.currentSortType === 'likes') {
          this.sortEvents();
        }
      },
      error: (err) => {
        console.error(err);

        event.isLiked = wasLiked;
        event.likesCount = previousLikesCount;
      }
    });
  }
}
