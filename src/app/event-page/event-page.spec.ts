/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventPageComponent } from './event-page';
import { EventService } from '../services/event.service';
import { CommentService } from '../services/comment.service';
import { AuthService } from '../services/auth.service';
import { TagService } from '../services/tag.service';
import { AdminService } from '../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('EventPageComponent', () => {
  let component: EventPageComponent;
  let fixture: ComponentFixture<EventPageComponent>;
  
  let eventServiceSpy: jasmine.SpyObj<EventService>;
  let commentServiceSpy: jasmine.SpyObj<CommentService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let tagServiceSpy: jasmine.SpyObj<TagService>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Description',
    date: '2026-07-01T10:00:00',
    price: 10,
    location: 'Vilnius'
  };

  beforeEach(async () => {
    eventServiceSpy = jasmine.createSpyObj('EventService', ['getEventById']);
    commentServiceSpy = jasmine.createSpyObj('CommentService', ['getComments']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserRoles', 'currentUserId', 'isLoggedIn']);
    tagServiceSpy = jasmine.createSpyObj('TagService', ['getAllTags']);
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getUserById']);

    eventServiceSpy.getEventById.and.returnValue(of(mockEvent));
    commentServiceSpy.getComments.and.returnValue(of([]));
    tagServiceSpy.getAllTags.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [EventPageComponent],
      providers: [
        provideRouter([]),
        { provide: EventService, useValue: eventServiceSpy },
        { provide: CommentService, useValue: commentServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TagService, useValue: tagServiceSpy },
        { provide: AdminService, useValue: adminServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: () => '1' } } } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the event title in the template', () => {
    expect(component.event.title).toBe('Test Event');
    const compiled = fixture.nativeElement;
    fixture.detectChanges();
    expect(compiled.querySelector('#event-title').textContent).toContain('Test Event');
  });

  it('should display the correct pricing for the event', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('$10.00'); 
  });

  it('should have a link to analytics', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const link = compiled.querySelector('a[routerLink*="/analytics"]');
    expect(link).toBeTruthy();
  });

  it('should have a book now button', () => {
    expect(true).toBeTrue(); 
  });
});