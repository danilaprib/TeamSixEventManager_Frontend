/// <reference types="jasmine" />

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout', 'currentUsername']);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: navSpy }
      ]
    });

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should show Login/Sign Up buttons when NOT logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    fixture.detectChanges();

    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    const signupLink = fixture.debugElement.query(By.css('a[routerLink="/signup"]'));

    expect(loginLink).toBeTruthy();
    expect(signupLink).toBeTruthy();
  });

  it('should show Logout button and username when logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.currentUsername.and.returnValue('TestUser');
    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('button.btn-link'));
    const usernameSpan = fixture.debugElement.query(By.css('.fw-bold'));

    expect(logoutButton).toBeTruthy();
    expect(usernameSpan.nativeElement.textContent).toContain('TestUser');
  });

  it('should call authService.logout and navigate to login when logout is clicked', () => {
    component.logout();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});