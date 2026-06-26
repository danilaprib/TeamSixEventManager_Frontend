/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Events } from './events';
import { EventService } from '../services/event.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('Events Component', () => {
  let component: Events;
  let fixture: ComponentFixture<Events>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;

  const mockEvents = [
    { id: '1', title: 'Tech Conf', price: 10, location: 'Vilnius', date: '2026-05-01', likes: 5 },
    { id: '2', title: 'Music Fest', price: 0, location: 'Kaunas', date: '2026-06-01', likes: 10 }
  ];

  beforeEach(() => {
    const eSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const aSpy = jasmine.createSpyObj('AuthService', ['currentUserId', 'isLoggedIn']);
    const rSpy = jasmine.createSpyObj('Router', ['events'], { events: of() });

    TestBed.configureTestingModule({
      imports: [Events],
      providers: [
        { provide: EventService, useValue: eSpy },
        { provide: AuthService, useValue: aSpy },
        { provide: Router, useValue: rSpy }
      ]
    });

    eventServiceSpy = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  it('should load and map events on init', () => {
    eventServiceSpy.getEvents.and.returnValue(of(mockEvents));
    fixture = TestBed.createComponent(Events);
    component = fixture.componentInstance;
    
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

  it('should filter events by price (FREE)', () => {
    component.allEvents = mockEvents as any;
    component.setSortType('free');
    
    expect(component.filteredEvents.length).toBe(1);
    expect(component.filteredEvents[0].price).toBe(0);
  });

  it('should update pagination logic', () => {
    component.filteredEvents = new Array(10).fill({});
    expect(component.totalPages).toBe(2);
    
    component.changePage(2);
    expect(component.currentPage).toBe(2);
  });
});