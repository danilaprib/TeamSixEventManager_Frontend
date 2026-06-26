/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Analytics } from './analytics';
import { AnalyticsService } from '../services/analytics.service';
import { EventService } from '../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Analytics Component', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;
  let analyticsServiceSpy: jasmine.SpyObj<AnalyticsService>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;

  beforeEach(() => {
    const aSpy = jasmine.createSpyObj('AnalyticsService', ['getAnalytics']);
    const eSpy = jasmine.createSpyObj('EventService', ['getEventById']);

    TestBed.configureTestingModule({
      imports: [Analytics],
      providers: [
        { provide: AnalyticsService, useValue: aSpy },
        { provide: EventService, useValue: eSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '123' } } } }
      ]
    });

    analyticsServiceSpy = TestBed.inject(AnalyticsService) as jasmine.SpyObj<AnalyticsService>;
    eventServiceSpy = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
  });

  it('should set error if no ID is provided', () => {
    // Override provider for this specific test
    TestBed.overrideProvider(ActivatedRoute, { useValue: { snapshot: { paramMap: { get: () => null } } } });
    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    component.ngOnInit();
    expect(component.errorMessage).toBe('Event id is missing.');
    expect(component.isLoading).toBe(false);
  });


  it('should set error message when services fail', () => {
    analyticsServiceSpy.getAnalytics.and.returnValue(throwError(() => new Error('fail')));
    eventServiceSpy.getEventById.and.returnValue(of({}));

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    component.ngOnInit();

    expect(component.errorMessage).toBe('Failed to load data for this event.');
    expect(component.isLoading).toBe(false);
  });
});