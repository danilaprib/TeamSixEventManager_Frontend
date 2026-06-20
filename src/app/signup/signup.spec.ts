/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SignupComponent } from './signup';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule, SignupComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should set error message if passwords do not match', () => {
    component.signupData.password = 'pass1';
    component.signupData.confirmPassword = 'pass2';
    
    component.onSignup();
    
    expect(component.errorMessage).toBe('Passwords do not match.');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should navigate to login on successful registration', () => {
    component.signupData = {
      username: 'test',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123'
    };
    authServiceSpy.register.and.returnValue(of({}));
    
    component.onSignup();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set error message on failed registration', () => {
    component.signupData = {
      username: 'test',
      email: 'test@test.com',
      password: '123',
      confirmPassword: '123'
    };
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Failed' } })));
    
    component.onSignup();
    
    expect(component.errorMessage).toBe('Failed');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBe(true);
  });
});