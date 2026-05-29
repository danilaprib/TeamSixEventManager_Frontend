import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';

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
  private authService = inject(AuthService);
  private eventService = inject(EventService);
  private router = inject(Router);

  locations = ['Vilnius', 'Klaipeda', 'Kaunas', 'Siauliai', 'Panevezys'];
  tags = [
    { name: 'Concerts', selected: false },
    { name: 'Football', selected: false },
    { name: 'Basketball', selected: false },
    { name: 'Art', selected: false },
    { name: 'Food', selected: false },
    { name: 'Tech', selected: false },
    { name: 'Business', selected: false },
    { name: 'Photography', selected: false },
    { name: 'Marathon', selected: false },
    { name: 'Jazz', selected: false },
    { name: 'Classical Music', selected: false },
    { name: 'Workshops', selected: false },
    { name: 'Networking', selected: false },
    { name: 'Outdoor', selected: false },
    { name: 'Family', selected: false },
  ];

  eventData = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  jsonPreview = '';

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.updatePreview();
  }

  toggleTag(tag: any) {
    tag.selected = !tag.selected;
    this.updatePreview();
  }

  updatePreview() {
    this.jsonPreview = JSON.stringify(this.buildPayload(), null, 2);
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
        this.errorMessage = err.error?.message || err.error?.title || 'Failed to create event.';
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
      tagNames: this.tags.filter(tag => tag.selected).map(tag => tag.name)
    };
  }
}
