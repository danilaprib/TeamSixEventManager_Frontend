import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';

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
})
export class Events implements OnInit {
  public authService = inject(AuthService);
  public eventService = inject(EventService);
  private router = inject(Router);

  isSortingAscending: boolean = false;
  currentSortType: string = 'date';

  allEvents: any[] = [];
  filteredEvents: any[] = [];
  selectedCities: string[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 3;

  get totalPages(): number {
    return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
  }

  get paginatedEvents(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEvents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get selectedCitiesDisplay(): string {
    return this.selectedCities.length === 0 ? 'All' : this.selectedCities.join(', ');
  }

  toggleCitySelection(city: string) {
    if (this.selectedCities.includes(city)) {
      this.selectedCities = this.selectedCities.filter(c => c !== city);
    } else {
      this.selectedCities = [...this.selectedCities, city];
    }
    this.filterAndSortEvents();
  }

  ngOnInit() {

    this.loadEvents();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        if (url === '/' || url === '/events') {
          this.loadEvents();
        }
      });
  }

  private loadEvents() {
    this.eventService.getEvents().subscribe({
      next: (backendData: any[]) => {
        const currentUserId = this.authService.currentUserId() || localStorage.getItem('userId');

        this.allEvents = backendData.map(item => {
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

          const likesList: any[] = item.eventLikes || item.EventLikes || [];

          const userHasLiked = currentUserId
            ? likesList.some(like => (like.UserId || like.user_id || '').toLowerCase() === currentUserId.toLowerCase())
            : false;

          return {
            id: item.Id || item.id,
            title: item.Title || item.title,
            description: item.Description || item.description,
            rawDate: new Date(item.Date || item.date),
            date: new Date(item.Date || item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: new Date(item.Date || item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            location: item.Location || item.location || 'Unknown',
            category: firstTag ? firstTag.toUpperCase() : 'EVENT',
            price: item.price ?? item.Price ?? 0,
            imageUrl: selectedImage,
            isLiked: userHasLiked,
            likesCount: likesList.length
          };
        });

        this.filteredEvents = [...this.allEvents];
        this.filterAndSortEvents();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleSortDirection() {
    this.isSortingAscending = !this.isSortingAscending;
    this.filterAndSortEvents();
  }

  setSortType(type: string) {
    this.currentSortType = type;
    this.filterAndSortEvents();
  }

  filterAndSortEvents() {
    let result = [...this.allEvents];

    if (this.selectedCities.length > 0) {
      result = result.filter(e =>
        this.selectedCities.some(selected =>
          e.location.toLowerCase() === selected.toLowerCase()
        )
      );
    }

    if (this.currentSortType === 'free') {
      result = result.filter(e => e.price === 0);
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (this.currentSortType === 'date') {
        comparison = a.rawDate.getTime() - b.rawDate.getTime();
      } else if (this.currentSortType === 'price') {
        comparison = a.price - b.price;
      } else if (this.currentSortType === 'likes') {
        comparison = a.likesCount - b.likesCount;
      } else if (this.currentSortType === 'free') {
        comparison = a.rawDate.getTime() - b.rawDate.getTime();
      }

      return this.isSortingAscending ? comparison : -comparison;
    });

    this.filteredEvents = result;
    this.currentPage = 1;
  }

  toggleLike(event: any, mouseEvent: MouseEvent) {
    mouseEvent.stopPropagation();
    mouseEvent.preventDefault();
  
    const wasLiked = event.isLiked;
    const targetId = event.id;
  
    // 1. Optimistic Update: Change UI immediately
    this.updateLocalEventState(targetId, !wasLiked);
  
    // 2. Persist to Backend
    this.eventService.toggleEventLike(targetId, wasLiked).subscribe({
      next: () => {
        // Backend success: state is now truly persisted
        console.log('Like toggled successfully');
      },
      error: (err) => {
        console.error('Failed to toggle like', err);
        // Revert if backend fails
        this.updateLocalEventState(targetId, wasLiked);
      }
    });
  }

  private updateLocalEventState(id: string, isLiked: boolean) {
    this.allEvents = this.allEvents.map(e => 
      e.id === id ? { ...e, isLiked, likesCount: isLiked ? e.likesCount + 1 : Math.max(0, e.likesCount - 1) } : e
    );
    this.filteredEvents = this.filteredEvents.map(e => 
      e.id === id ? { ...e, isLiked, likesCount: isLiked ? e.likesCount + 1 : Math.max(0, e.likesCount - 1) } : e
    );
  }

}