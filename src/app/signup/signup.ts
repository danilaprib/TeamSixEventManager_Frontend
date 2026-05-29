import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styles: ``,
})
export class SignupComponent {

private authService = inject(AuthService);
  private router = inject(Router);

  signupData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';

  onSignup() {
    if (this.signupData.password !== this.signupData.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const payload = {
      username: this.signupData.username,
      email: this.signupData.email,
      password: this.signupData.password
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        console.log('Registration successful:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        this.errorMessage = err.error?.message || 'Registration failed. Check password rules.';
      }
    });
  }

}
