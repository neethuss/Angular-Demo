import { Component } from '@angular/core';
import { LogoutmodalComponent } from '../logoutmodal/logoutmodal.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LogoutmodalComponent, NgIf, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  showLogoutModal:boolean=false


 
  logout(){
    this.showLogoutModal = true
    console.log('showing modal')
  }

  onCancelLogout(){
    this.showLogoutModal = false
  }
}
