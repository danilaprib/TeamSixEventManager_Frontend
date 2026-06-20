/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { EventPageComponent } from './event-page';
import { RouterLink } from '@angular/router';

describe('EventPageComponent', () => {
  let component: EventPageComponent;
  let fixture: ComponentFixture<EventPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventPageComponent, RouterLink]
    });

    fixture = TestBed.createComponent(EventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the event title in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Tech Conference');
  });

  it('should display the correct pricing for the event', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const priceText = compiled.querySelector('.display-6')?.textContent;
    expect(priceText).toBe('FREE');
  });

  it('should have a book now button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button.btn-success');
    expect(button?.textContent).toContain('Book Now');
  });

  it('should have a link to analytics', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const link = compiled.querySelector('a[routerLink="/analytics/1"]');
    expect(link).toBeTruthy();
    expect(link?.textContent).toContain('Go to Analytics');
  });
});