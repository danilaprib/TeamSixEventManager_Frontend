/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserPage } from './user-page';
import { AuthService } from '../services/auth.service';
import { EventService } from '../services/event.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('UserPage', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let eventServiceSpy: jasmine.SpyObj<EventService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'currentUsername', 'currentUserEmail', 'currentUserId', 'currentUserRole', 'logout', 'deleteAccount']);
    const eventSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule, UserPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EventService, useValue: eventSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    eventServiceSpy = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should redirect to login if not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should toggle tag selection', () => {
    const tag = { name: 'Art', selected: false };
    component.toggleTag(tag);
    expect(tag.selected).toBe(true);
  });

  it('should reset all tags', () => {
    component.resetTags();
    const allSelected = component.allTags.every(t => !t.selected);
    expect(allSelected).toBe(true);
  });

  it('should update active tab', () => {
    component.setActiveTab('liked');
    expect(component.activeTab).toBe('liked');
  });

  it('should logout and navigate on logout click', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should delete account and navigate on success', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    authServiceSpy.deleteAccount.and.returnValue(of({}));
    
    component.deleteAccount();
    
    expect(authServiceSpy.deleteAccount).toHaveBeenCalled();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/signup']);
  });
});