/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SignupComponent, FormsModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should navigate to login on successful registration', () => {
    component.signupData = { username: 'user', email: 'a@a.com', password: '123', confirmPassword: '123' };
    authServiceSpy.register.and.returnValue(of({}));

    component.onSignup();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set error message on failed registration', () => {
    component.signupData = { username: 'user', email: 'a@a.com', password: '123', confirmPassword: '123' };
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'User already exists' } })));

    component.onSignup();

    expect(component.errorMessage).toBe('User already exists');
  });

  it('should set error message if passwords do not match', () => {
    component.signupData = { username: 'user', email: 'a@a.com', password: '123', confirmPassword: '456' };
    
    component.onSignup();

    expect(component.errorMessage).toBe('Passwords do not match.');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBeTrue();
    
    expect(component.showConfirmPassword).toBeFalse();
    component.showConfirmPassword = !component.showConfirmPassword;
    expect(component.showConfirmPassword).toBeTrue();
  });
});