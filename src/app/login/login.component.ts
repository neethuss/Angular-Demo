import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface Login {
  email: string;
  password: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',

})
export class LoginComponent {

  lang: string = 'en';
  theme: string = 'blue'
  showCommonError = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService, private translate:TranslateService) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.lang = params['lang'] || 'en';
      this.theme = params['theme'] || 'blue'
      console.log('Language in LoginComponent:', this.lang);
    });
  }
  onSubmit(): void {
    this.showCommonError = false
    if (this.loginForm.invalid) {
      this.showCommonError = true;
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value as Login;
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log(response.message);
        const token = response.token;
        localStorage.setItem('authToken', token);
        this.translate.get('success.loginSuccess').subscribe((message: string) => {
          this.toastr.success(message);
        });
        this.router.navigate([`/${this.lang}/${this.theme}/home`]);
      },
      error: (err) => {
        if (err.message) {
          this.toastr.error(err.message);
        }
      },
    });

  }


  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
  }

}
