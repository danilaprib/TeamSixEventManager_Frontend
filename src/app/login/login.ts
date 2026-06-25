import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

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
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.error) {
            this.errorMessage = res.error;
            return;
          }
          this.showSuccessToast = true;
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Login failed:', err);
          if (err.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (err.status === 403) {
            this.errorMessage = 'You have been blocked. Please contact an administrator.';
          } else if (err.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Please try again.';
          } else {
            this.errorMessage = 'Server error. Please try again later.';
          }
        }
      });
  }
}