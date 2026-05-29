import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-page.html',
  styles: `
    .hover-gray{
      background-color: #FFFFFF;
      transition: 0.2s;
    }
    .hover-gray:hover{
      background-color: #eaeaea;
    }
    .nav-pills .nav-link.active {
      background-color: var(--main-color) !important;
      color: white !important;
    }
    .nav-link:hover:not(.active) {
        background-color: #dadada !important;
    }
  `
})
export class UserPage implements OnInit {
  public authService = inject(AuthService);
  private eventService = inject(EventService);
  private router = inject(Router);

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  activeTab: string = 'profile';
  likedEvents: any[] = [];
  likedEventsError = '';

  profileData = {
    username: '',
    email: ''
  };

  tags = [
    { name: 'Concerts', selected: true },
    { name: 'Football', selected: true },
    { name: 'Basketball', selected: false },
    { name: 'Art', selected: false },
    { name: 'Food', selected: true },
    { name: 'Tech', selected: true },
    { name: 'Business', selected: false },
    { name: 'Photography', selected: false },
    { name: 'Marathon', selected: false },
    { name: 'Jazz', selected: false },
    { name: 'Clasicall Music', selected: false },
    { name: 'Workshops', selected: false },
    { name: 'Networking', selected: false },
    { name: 'Outdoor', selected: false },
    { name: 'Family', selected: false },
  ];

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileData.username = this.authService.currentUsername() || '';
    this.profileData.email = this.authService.currentUserEmail() || '';
    this.loadLikedEvents();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleTag(tag: any) {
    tag.selected = !tag.selected;
  }

  resetTags() {
    this.tags.forEach(t => t.selected = false);
  }

  get selectedCount() {
    return this.tags.filter(t => t.selected).length;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  private loadLikedEvents() {
    const currentUserId = this.authService.currentUserId()?.toLowerCase();

    if (!currentUserId) {
      this.likedEvents = [];
      return;
    }

    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.likedEvents = events
          .filter(event => this.eventWasLikedByCurrentUser(event, currentUserId))
          .map(event => this.mapEvent(event));
      },
      error: (err) => {
        console.error('Failed to load liked events:', err);
        this.likedEventsError = 'Failed to load liked events.';
      }
    });
  }

  private eventWasLikedByCurrentUser(event: any, currentUserId: string) {
    const likes = event.EventLikes || event.eventLikes || [];
    return likes.some((like: any) => String(like.UserId || like.userId || like.user_id || '').toLowerCase() === currentUserId);
  }

  private mapEvent(event: any) {
    const eventDate = new Date(event.Date || event.date);
    const tagsArray = event.EventTags || event.eventTags;
    const firstTagEntity = tagsArray && tagsArray[0];
    const tagObj = firstTagEntity ? (firstTagEntity.Tag || firstTagEntity.tag) : null;
    const firstTag = tagObj ? (tagObj.Name || tagObj.name || '').toLowerCase() : '';

    return {
      id: event.Id || event.id,
      title: event.Title || event.title,
      date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: event.Location || event.location || 'Unknown',
      category: firstTag ? firstTag.toUpperCase() : 'EVENT',
      price: event.Price !== undefined ? event.Price : (event.price !== undefined ? event.price : 0),
      imageUrl: this.getImageForTag(firstTag)
    };
  }

  private getImageForTag(tag: string) {
    if (tag.includes('sport') || tag.includes('basketball') || tag.includes('football')) {
      return 'assets/images/sports.jpg';
    }

    if (tag.includes('music') || tag.includes('concert')) {
      return 'assets/images/music.jpg';
    }

    if (tag.includes('outdoor') || tag.includes('nature')) {
      return 'assets/images/outdoors.jpg';
    }

    return 'assets/images/default.jpg';
  }


  deleteAccount() {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmed) {
      return;
    }

    this.authService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/signup']);
      },
      error: (err) => {
        console.error('Delete account failed:', err);
        window.alert(err.error?.message || err.error?.title || 'Failed to delete account.');
      }
    });
  }

}
