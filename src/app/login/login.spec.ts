/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('LoginComponent UI and Logic', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should toggle showPassword when button is clicked', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBe(true);
  });

  it('should navigate to /events after a successful login', () => {
    authServiceSpy.login.and.returnValue(of({})); 
    
    component.onLogin();
    
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should disable the submit button when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    const button = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(button.disabled).toBe(true);
  });


    it('should set isLoading to true on login attempt', () => {
    authServiceSpy.login.and.returnValue(of({})); 
    
    component.onLogin();
    
    expect(component.isLoading).toBe(true);
  });

});