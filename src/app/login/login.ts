import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styles: `
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
    }
  `,
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;
  errorMessage = '';
  isLoading = false;
  showSuccessToast = false;

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.isLoading = false;
        this.showSuccessToast = true;


        this.router.navigate(['/events']);


        // setTimeout(() => {
        //   this.router.navigate(['/']);
        // }, 1200);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password combination.';
      }
    });
  }

}