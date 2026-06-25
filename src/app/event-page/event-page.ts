import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { EventService } from '../services/event.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CommentService } from '../services/comment.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TagService } from '../services/tag.service';
import { TagDto } from '../models/tag.model';
import { AdminService } from "../services/admin.service";

interface SelectableTag extends TagDto { selected: boolean; }

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './event-page.html',
  styles: `...`
})
export class EventPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  public authService = inject(AuthService);
  private tagService = inject(TagService);
  private adminService = inject(AdminService);

  event: any = null;
  comments: any[] = [];
  newCommentText: string = '';

  isEditing = false;
  isSaving = false;
  editErrorMessage = '';
  editEventData: any = {};
  allTags: SelectableTag[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEventData(id);
    }
    this.loadTags();
  }

  loadTags() {
    this.tagService.getAllTags().subscribe({
      next: (data) => this.allTags = data.map(tag => ({ ...tag, selected: false })),
      error: (err) => console.error('Error fetching tags:', err)
    });
  }

  loadEventData(id: string) {

    this.eventService.getEventById(id).subscribe(data => {

      console.log('API Response:', data);

      this.event = {
        ...data,
        id: data.id || data.Id,
        title: data.title || data.Title,
        description: data.description || data.Description,
        date: data.date || data.Date,
        location: data.location || data.Location,
        price: data.price ?? data.Price ?? 0,
        imageUrl: data.imageUrl || data.ImageUrl || '../assets/images/default.jpg',
        likes: data.likes ?? data.likesCount ?? 0,
        attendees: data.Attendees ?? data.attendees ?? 0,
        organizerId: data.organizerId || data.OrganizerId || data.organizer?.id || data.Organizer?.id,
        organizer: data.organizer || data.Organizer || data.user || data.User || null,
        isAttending: false,
      };

      // if we dont have full organizer details fetch them using AdminService
      if (!this.event.organizer && this.event.organizerId) {
        this.adminService.getUserById(this.event.organizerId).subscribe({
          next: (userData) => {
            this.event.organizer = {
              userName: userData.userName || userData.username || 'Unknown',
              email: userData.email || userData.Email || ''
            };
            this.cdr.markForCheck();
          },
          error: (err) => console.error('Failed to fetch organizer details', err)
        });
      }

      this.loadComments(id);
    });
  }


  toggleAttendance() {
    if (!this.authService.isLoggedIn()) return;

    const previousState = this.event.isAttending;
    this.event.isAttending = !previousState;

    this.eventService.toggleEventAttendance(this.event.id, previousState).subscribe({
      next: () => {
        this.loadEventData(this.event.id);
      },
      error: () => {
        this.event.isAttending = previousState;
        this.cdr.detectChanges();
      }
    });
  }

  isOrganizerForEvent(event: any): boolean {
    const roles = this.authService.getUserRoles();
    console.log(roles);
    console.log(this.event.organizerId);
    return (String(event?.organizerId) === String(this.authService.currentUserId()));
  }

  enableEdit() {
    this.isEditing = true;
    const dateObj = new Date(this.event.date);

    this.editEventData = {
      title: this.event.title,
      description: this.event.description,
      date: dateObj.toISOString().slice(0, 10),
      time: dateObj.toTimeString().slice(0, 5),
      location: this.event.location,
      price: this.event.price
    };

    this.editErrorMessage = '';
    // Sync tags
    const eventTagNames = this.event.tags || [];
    this.allTags.forEach(t => t.selected = eventTagNames.includes(t.name));
  }

  cancelEdit() {
    this.isEditing = false;
    this.editEventData = {};
    this.editErrorMessage = '';
  }

  saveEdit() {
    if (!this.editEventData.title || !this.editEventData.description) {
      this.editErrorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.allTags.every(tag => !tag.selected)) {
      this.editErrorMessage = 'Please select at least one tag.';
      return;
    }

    this.isSaving = true;
    const payload = {
      ...this.editEventData,
      date: new Date(`${this.editEventData.date}T${this.editEventData.time}`).toISOString(),
      price: Number(this.editEventData.price) || 0,
      tags: this.allTags.filter(t => t.selected).map(t => t.name)
    };

    this.eventService.updateEvent(this.event.id, payload).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditing = false;
        this.loadEventData(this.event.id);
      },
      error: (err) => {
        this.editErrorMessage = err.error?.message || 'Failed to update event.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleTag(tag: SelectableTag) { tag.selected = !tag.selected; }

  loadComments(id: string) {
    this.commentService.getComments(id).subscribe(data => {
      this.comments = data;
      this.cdr.markForCheck();
    });
  }

  postComment() {
    if (!this.newCommentText.trim() || !this.event) return;
    this.commentService.addComment(this.event.id, this.newCommentText).subscribe({
      next: () => {
        this.newCommentText = '';
        this.loadComments(this.event.id);
      }
    });
  }
}