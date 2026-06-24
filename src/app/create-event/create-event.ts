import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { TagService } from '../services/tag.service';
import { TagDto } from '../models/tag.model';

interface SelectableTag extends TagDto {
  selected: boolean;
}

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './create-event.html',
  styles: `
    .create-card {
      max-width: 850px;
    }
  `,
})
export class CreateEventComponent implements OnInit {
  private tagService = inject(TagService);
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private router = inject(Router);

  locations = ['Vilnius', 'Klaipeda', 'Kaunas', 'Siauliai', 'Panevezys'];
  tags: SelectableTag[] = [];

  eventData: any = { title: '', description: '', date: '', time: '', location: '', price: 0, tagIds: [] };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  jsonPreview = '';

  ngOnInit() {

    const roles = this.authService.getUserRoles();
    const canCreate = roles.includes('Admin') || roles.includes('Organizer');

    if (!canCreate) {
      this.errorMessage = 'You do not have permission to create events.';
      this.router.navigate(['/']);
      return;
    }

    this.tagService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data.map(tag => ({ ...tag, selected: false }));
      },
      error: (err) => console.error('Error fetching tags:', err)
    });
  }

  toggleTag(tag: SelectableTag) {
    tag.selected = !tag.selected;
    this.updatePreview();
  }

  updatePreview() {
    this.eventData.tagNames = this.tags
      .filter(t => t.selected)
      .map(t => t.name);

    this.jsonPreview = JSON.stringify(this.eventData, null, 2);
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.eventData.title || !this.eventData.description || !this.eventData.date || !this.eventData.time || !this.eventData.location) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.tags.every(tag => !tag.selected)) {
      this.errorMessage = 'Please select at least one tag.';
      return;
    }

    this.isSubmitting = true;
    const payload = this.buildPayload();

    this.eventService.createEvent(payload).subscribe({
      next: () => {
        this.successMessage = 'Event created successfully.';
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Create event failed:', err);
        if (err.status === 403) {
          this.errorMessage = 'You are not authorized to create events. Only Organizers or Admins can perform this action.';
        } else {
          this.errorMessage = err.error?.message || err.error?.title || 'Failed to create event.';
        }
        this.isSubmitting = false;
      }
    });
  }

  private buildPayload() {
    return {
      title: this.eventData.title,
      description: this.eventData.description,
      date: this.eventData.date && this.eventData.time ? new Date(`${this.eventData.date}T${this.eventData.time}`).toISOString() : '',
      location: this.eventData.location,
      price: Number(this.eventData.price) || 0,
      tags: this.tags.filter(tag => tag.selected).map(tag => tag.name)
    };
  }
}
