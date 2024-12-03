import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-logoutmodal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './logoutmodal.component.html',
  styleUrl: './logoutmodal.component.css'
})
export class LogoutmodalComponent {
  @Output() cancel = new EventEmitter<void>()


  constructor(private router: Router) {

  }

  cancelLogout() {
    this.cancel.emit()
  }

  proceedLogout() {
    localStorage.removeItem('authToken')
    this.router.navigate(['/login']);
    return false;
  }
}
