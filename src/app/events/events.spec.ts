/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Events } from './events';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('Events', () => {
  let component: Events;
  let fixture: ComponentFixture<Events>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockEvents = [
    { id: '1', title: 'Tech Conf', price: 10, location: 'Vilnius', date: '2026-05-01', eventLikes: [] },
    { id: '2', title: 'Music Fest', price: 0, location: 'Kaunas', date: '2026-06-01', eventLikes: [] }
  ];

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUserId', 'isLoggedIn']);
    const eventSpy = jasmine.createSpyObj('EventService', ['getEvents', 'toggleEventLike']);
    const navSpy = jasmine.createSpyObj('Router', ['events']);
    navSpy.events = of();

    TestBed.configureTestingModule({
      imports: [FormsModule, Events],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EventService, useValue: eventSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    fixture = TestBed.createComponent(Events);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    eventServiceSpy = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should load and map events on init', () => {
    eventServiceSpy.getEvents.and.returnValue(of(mockEvents));
    component.ngOnInit();
    expect(component.allEvents.length).toBe(2);
    expect(component.filteredEvents.length).toBe(2);
  });

  it('should filter events by city', () => {
    component.allEvents = mockEvents as any;
    component.selectedCities = ['Vilnius'];
    component.filterAndSortEvents();
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].location).toBe('Vilnius');
  });

  it('should filter events by free price', () => {
    component.allEvents = mockEvents as any;
    component.setSortType('free');
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].price).toBe(0);
  });

  it('should change pagination page', () => {
    component.allEvents = mockEvents as any;
    component.filteredEvents = mockEvents as any;
    component.changePage(2);
    expect(component.currentPage).toBe(2);
  });

  it('should toggle like status and update counts', () => {
    component.allEvents = [{ id: '1', isLiked: false, likesCount: 5 }] as any;
    component.filteredEvents = component.allEvents;
    eventServiceSpy.toggleEventLike.and.returnValue(of({}));
    
    const mouseEvent = { stopPropagation: () => {}, preventDefault: () => {} } as any;
    component.toggleLike(component.allEvents[0], mouseEvent);
    
    expect(component.allEvents[0].isLiked).toBe(true);
    expect(component.allEvents[0].likesCount).toBe(6);
  });

  it('should revert like state on error', () => {
    component.allEvents = [{ id: '1', isLiked: false, likesCount: 5 }] as any;
    component.filteredEvents = component.allEvents;
    eventServiceSpy.toggleEventLike.and.returnValue(throwError(() => new Error('fail')));
    
    const mouseEvent = { stopPropagation: () => {}, preventDefault: () => {} } as any;
    component.toggleLike(component.allEvents[0], mouseEvent);
    
    expect(component.allEvents[0].isLiked).toBe(false);
    expect(component.allEvents[0].likesCount).toBe(5);
  });
});