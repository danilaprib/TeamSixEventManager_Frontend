/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login() should store token and role in localStorage on success', () => {
    const mockResponse = { token: 'fake-jwt-token', role: 'Admin' };
    
    service.login({ email: 'test@test.com', password: '123' }).subscribe();

    const req = httpMock.expectOne('https://teamsixeventmanager-backend-develop.onrender.com/api/auth/login');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('role')).toBe('Admin');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('logout() should clear localStorage and signals', () => {
    localStorage.setItem('token', 'exists');
    service.logout();
    
    expect(localStorage.getItem('token')).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });
});