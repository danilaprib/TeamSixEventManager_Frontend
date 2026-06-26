/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin';
import { AdminService } from '../services/admin.service';
import { OrganizerService } from '../services/organizer.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let organizerServiceSpy: jasmine.SpyObj<OrganizerService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getUsers',
      'blockUser',
      'unblockUser'
    ]);

    organizerServiceSpy = jasmine.createSpyObj('OrganizerService', [
      'getOrganizerRequests',
      'approveRequest',
      'disapproveRequest'
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'hasRole'
    ]);

    routerSpy = jasmine.createSpyObj('Router', [
      'navigate'
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: OrganizerService, useValue: organizerServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;

    adminServiceSpy.getUsers.and.returnValue(of([]));
    organizerServiceSpy.getOrganizerRequests.and.returnValue(of([]));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect non-admin users', () => {
    authServiceSpy.hasRole.and.returnValue(false);

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should load data for admin users', () => {
    authServiceSpy.hasRole.and.returnValue(true);

    spyOn(component, 'loadData');

    component.ngOnInit();

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should load users successfully', () => {
    adminServiceSpy.getUsers.and.returnValue(
      of([
        {
          id: '1',
          username: 'john',
          email: 'john@test.com',
          isBlocked: false
        }
      ])
    );

    organizerServiceSpy.getOrganizerRequests.and.returnValue(of([]));

    component.loadData();

    expect(component.users.length).toBe(1);
    expect(component.users[0].username).toBe('john');
  });

  it('should load requests successfully', () => {
    adminServiceSpy.getUsers.and.returnValue(of([]));

    organizerServiceSpy.getOrganizerRequests.and.returnValue(
      of([
        {
          userId: '1',
          username: 'john',
          reason: 'test',
          status: 1
        }
      ])
    );

    component.loadData();

    expect(component.requests.length).toBe(1);
    expect(component.requests[0].reason).toBe('test');
  });

  it('should handle getUsers error', () => {
    adminServiceSpy.getUsers.and.returnValue(
      throwError(() => new Error('fail'))
    );

    organizerServiceSpy.getOrganizerRequests.and.returnValue(of([]));

    component.loadData();

    expect(component.errorMessage)
      .toBe('Failed to load users.');
  });

  it('should handle getOrganizerRequests error', () => {
    adminServiceSpy.getUsers.and.returnValue(of([]));

    organizerServiceSpy.getOrganizerRequests.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadData();

    expect(component.errorMessage)
      .toBe('Failed to load organizer requests.');
  });

  it('should approve request successfully', () => {
    organizerServiceSpy.approveRequest.and.returnValue(of({}));

    spyOn(component, 'loadData');

    component.approve('123');

    expect(organizerServiceSpy.approveRequest)
      .toHaveBeenCalledWith('123');

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should handle approve error', () => {
    organizerServiceSpy.approveRequest.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.approve('123');

    expect(component.errorMessage)
      .toBe('Failed to approve request.');
  });

  it('should disapprove request successfully', () => {
    organizerServiceSpy.disapproveRequest.and.returnValue(of({}));

    spyOn(component, 'loadData');

    component.disapprove('123');

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should handle disapprove error', () => {
    organizerServiceSpy.disapproveRequest.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.disapprove('123');

    expect(component.errorMessage)
      .toBe('Failed to disapprove request.');
  });

  it('should block user', () => {
    adminServiceSpy.blockUser.and.returnValue(of({}));

    spyOn(component, 'loadData');

    component.toggleBlock({
      id: '1',
      username: 'john',
      email: 'john@test.com',
      isBlocked: false
    });

    expect(adminServiceSpy.blockUser)
      .toHaveBeenCalledWith('1');

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should unblock user', () => {
    adminServiceSpy.unblockUser.and.returnValue(of({}));

    spyOn(component, 'loadData');

    component.toggleBlock({
      id: '1',
      username: 'john',
      email: 'john@test.com',
      isBlocked: true
    });

    expect(adminServiceSpy.unblockUser)
      .toHaveBeenCalledWith('1');

    expect(component.loadData).toHaveBeenCalled();
  });

  it('should handle block user error', () => {
    adminServiceSpy.blockUser.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.toggleBlock({
      id: '1',
      username: 'john',
      email: 'john@test.com',
      isBlocked: false
    });

    expect(component.errorMessage)
      .toBe('Failed to block user.');
  });

  it('should handle unblock user error', () => {
    adminServiceSpy.unblockUser.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.toggleBlock({
      id: '1',
      username: 'john',
      email: 'john@test.com',
      isBlocked: true
    });

    expect(component.errorMessage)
      .toBe('Failed to unblock user.');
  });

  it('should switch tabs', () => {
    component.activeTab = 'requests';

    component.activeTab = 'users';

    expect(component.activeTab).toBe('users');
  });
});