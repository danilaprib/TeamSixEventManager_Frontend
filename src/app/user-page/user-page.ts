import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { TagService } from '../services/tag.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './user-page.html',
  styles: `
    .hover-gray{ background-color: #FFFFFF; transition: 0.2s; }
    .hover-gray:hover{ background-color: #eaeaea; }
    .nav-pills .nav-link.active { background-color: var(--main-color) !important; color: white !important; }
    .nav-link:hover:not(.active) { background-color: #dadada !important; }
  `
})
export class UserPage implements OnInit {
  public authService = inject(AuthService);
  public tagService = inject(TagService);
  public userService = inject(UserService);
  private eventService = inject(EventService);
  private router = inject(Router);

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  activeTab: string = 'profile';
  likedEvents: any[] = [];
  likedEventsError = '';
  profileData = { username: '', email: '' };
  allTags: any[] = [];

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.profileData.username = this.authService.currentUsername() || '';
    this.profileData.email = this.authService.currentUserEmail() || '';
    this.tagService.getAllTags().subscribe(tags => {
      this.allTags = tags.map(t => ({ ...t, selected: false }));
      this.loadUserInterests();
    });
    this.loadLikedEvents();
  }

  loadUserInterests() {
    this.userService.getMyTags().subscribe(savedTags => {
      this.allTags.forEach(tag => {
        if (savedTags.some(s => s.id === tag.id)) tag.selected = true;
      });
    });
  }

  get userRoles(): string[] {
    return this.authService.getUserRoles();
  }

  saveInterests() {
    const selectedIds = this.allTags.filter(t => t.selected).map(t => t.id);
    this.userService.updateMyTags(selectedIds).subscribe(() => {
      alert('Preferences saved successfully!');
    });
  }

  toggleTag(tag: any) { tag.selected = !tag.selected; }
  resetTags() { this.allTags.forEach(t => t.selected = false); }
  get selectedCount() { return this.allTags.filter(t => t.selected).length; }
  setActiveTab(tab: string) { this.activeTab = tab; }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadLikedEvents() {
    const currentUserId = this.authService.currentUserId()?.toLowerCase();
    if (!currentUserId) return;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.likedEvents = events
          .filter(e => this.eventWasLikedByCurrentUser(e, currentUserId))
          .map(e => this.mapEvent(e));
      },
      error: () => this.likedEventsError = 'Failed to load liked events.'
    });
  }

  private eventWasLikedByCurrentUser(event: any, currentUserId: string) {
    const likes = event.EventLikes || event.eventLikes || [];
    return likes.some((l: any) => String(l.UserId || l.userId || l.user_id || '').toLowerCase() === currentUserId);
  }

  private mapEvent(event: any) {
    const eventDate = new Date(event.Date || event.date);
    const tagsArray = event.EventTags || event.eventTags;
    const firstTag = tagsArray?.[0]?.Tag?.name || tagsArray?.[0]?.tag?.name || '';
    return {
      id: event.Id || event.id,
      title: event.Title || event.title,
      date: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      location: event.Location || event.location || 'Unknown',
      imageUrl: this.getImageForTag(firstTag.toLowerCase())
    };
  }

  private getImageForTag(tag: string) {
    if (tag.includes('sport') || tag.includes('basketball')) return 'assets/images/sports.jpg';
    if (tag.includes('music') || tag.includes('concert')) return 'assets/images/music.jpg';
    return 'assets/images/default.jpg';
  }

  deleteAccount() {
    if (window.confirm('Are you sure?')) {
      this.authService.deleteAccount().subscribe(() => {
        this.authService.logout();
        this.router.navigate(['/signup']);
      });
    }
  }
}