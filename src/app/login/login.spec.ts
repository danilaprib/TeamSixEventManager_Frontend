/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]), 
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error when fields are empty', () => {
    component.loginData = { email: '', password: '' };
    component.onLogin();
    expect(component.errorMessage).toBe('Please fill in all fields.');
  });

  it('should login successfully and navigate', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(of({}));

    component.onLogin();

    expect(component.showSuccessToast).toBeTrue();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should display API error message returned by backend', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(of({ error: 'Invalid credentials' }));

    component.onLogin();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should handle 401 error', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 401 })));

    component.onLogin();

    expect(component.errorMessage).toBe('Invalid email or password.');
  });

  it('should handle 403 error', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 403 })));

    component.onLogin();

    expect(component.errorMessage).toBe('You have been blocked. Please contact an administrator.');
  });

  it('should handle timeout error', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(throwError(() => ({ name: 'TimeoutError' })));

    component.onLogin();

    expect(component.errorMessage).toBe('Request timed out. Please try again.');
  });

  it('should handle generic server error', () => {
    component.loginData = { email: 'test@test.com', password: '123' };
    authServiceSpy.login.and.returnValue(throwError(() => ({ status: 500 })));

    component.onLogin();

    expect(component.errorMessage).toBe('Server error. Please try again later.');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();

    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBeTrue();

    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBeFalse();
  });
});