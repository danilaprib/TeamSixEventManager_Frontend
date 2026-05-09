import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
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

  isLoggedIn: Boolean = false

  logout(){
    this.isLoggedIn = false;
  }

}
