/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { UserPage } from './user-page';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { TagService } from '../services/tag.service';
import { of } from 'rxjs';

describe('UserPage Component', () => {
  let component: UserPage;
  let fixture: ComponentFixture<UserPage>;
  
  const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'currentUsername', 'currentUserEmail', 'updateUserRole', 'logout', 'deleteAccount']);
  const userSpy = jasmine.createSpyObj('UserService', ['getCurrentUserProfile', 'getMyTags', 'getOrganizerRequestStatus', 'submitOrganizerRequest', 'updateMyTags']);
  const tagSpy = jasmine.createSpyObj('TagService', ['getAllTags']);

  beforeEach(() => {
    authSpy.isLoggedIn.and.returnValue(true);
    userSpy.getCurrentUserProfile.and.returnValue(of({ role: 'User' }));
    userSpy.getMyTags.and.returnValue(of([]));
    userSpy.getOrganizerRequestStatus.and.returnValue(of({ status: 1 }));
    tagSpy.getAllTags.and.returnValue(of([{ id: 1, name: 'Music' }]));

    TestBed.configureTestingModule({
      imports: [UserPage],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: UserService, useValue: userSpy },
        { provide: TagService, useValue: tagSpy }
      ]
    });

    fixture = TestBed.createComponent(UserPage);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger ngOnInit
  });

  it('should initialize and set active tab to profile', () => {
    expect(component.activeTab).toBe('profile');
  });

  it('should toggle tag selection', () => {
    const mockTag = { id: 1, name: 'Music', selected: false };
    component.toggleTag(mockTag);
    expect(mockTag.selected).toBe(true);
  });

  it('should calculate correct selected count', () => {
    component.allTags = [{ id: 1, selected: true }, { id: 2, selected: false }];
    expect(component.selectedCount).toBe(1);
  });

  it('should submit request only if reason is long enough', () => {
    spyOn(window, 'alert');
    component.requestReason = 'short';
    component.submitOrganizerRequest();
    expect(window.alert).toHaveBeenCalledWith('The reason must be at least 10 characters long.');
  });
});