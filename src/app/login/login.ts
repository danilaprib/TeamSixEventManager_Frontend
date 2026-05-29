import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styles: ``,
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

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid email or password combination.';
      }
    });
  }

}
