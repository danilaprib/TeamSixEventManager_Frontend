import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink, ActivatedRoute } from "@angular/router";
import { EventService } from '../services/event.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CommentService } from '../services/comment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [RouterLink, CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './event-page.html',
  styles: `...`
})
export class EventPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);
  private commentService = inject(CommentService);
  
  event: any = null;
  comments: any[] = [];
  newCommentText: string = '';


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEventData(id);
    }
  }

  loadEventData(id: string) {
    this.eventService.getEventById(id).subscribe(data => {
      this.event = {
        ...data,
        id: data.id || data.Id,
        title: data.title || data.Title,
        description: data.description || data.Description,
        date: data.date || data.Date,
        location: data.location || data.Location,
        price: data.price ?? data.Price ?? 0,
        imageUrl: data.imageUrl || data.ImageUrl || '../assets/images/default.jpg',
        likes: data.likes ?? data.likesCount ?? data.EventLikes?.length ?? data.eventLikes?.length ?? 0
      };
      this.loadComments(id);
    });
  }

  loadComments(id: string) {
    this.commentService.getComments(id).subscribe(data => {
      this.comments = data;
      this.cdr.markForCheck();
    });
  }

  postComment() {
    if (!this.newCommentText.trim() || !this.event) return;
    
    const eventId = this.event.id || this.event.Id;

    this.commentService.addComment(eventId, this.newCommentText).subscribe({
      next: () => {
        this.newCommentText = ''; 
        this.loadComments(eventId);
      },
      error: (err) => {
        if (err.status === 401) {
          console.error('You are not logged in!');
        }
      }
    });
  }

}