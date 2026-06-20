/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('getEvents() should fetch events from the correct URL', () => {
    service.getEvents().subscribe(events => {
      expect(events.length).toBe(1);
    });

    const req = httpMock.expectOne('https://teamsixeventmanager-backend-develop.onrender.com/api/events');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', title: 'Test Event' }]);
  });

  it('toggleEventLike() should call DELETE when isCurrentlyLiked is true', () => {
    localStorage.setItem('token', 'abc');
    
    service.toggleEventLike('123', true).subscribe();

    const req = httpMock.expectOne('https://teamsixeventmanager-backend-develop.onrender.com/api/events/123/like');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush({});
  });
});