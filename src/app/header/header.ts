import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styles: `
  .logo{
    transition: 0.2s;
  }
  .logo:hover{
    transform: scale(1.1);
  }
  `,
})
export class HeaderComponent {

  public authService = inject(AuthService);
  private router = inject(Router);

  
  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
