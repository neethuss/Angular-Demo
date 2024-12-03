import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, NgIf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../services/validationService';

interface Signup {
  name: string;
  email: string;
  password: string
}



export function passwordsMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value !== confirmPassword.value
      ? { passwordsMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule,HttpClientModule, NgIf, TranslateModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {

  lang: string = 'en';
  theme:string = 'blue'
  showCommonError = false;

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4),Validators.pattern('^[a-zA-Z]+$')]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  },{ validators: passwordsMatchValidator() })

  constructor(private authService: AuthService, private router: Router, private location:Location, private activatedRoute:ActivatedRoute,  private toastr: ToastrService, private validationService:ValidationService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.lang = params['lang'] || 'en';
      this.theme= params['theme'] || 'blue'
      console.log('Language in LoginComponent:', this.lang, this.theme);
    });
  }

  get emailIsInvalid() {
    return this.signupForm.controls.email.touched && this.signupForm.controls.email.dirty && this.signupForm.controls.email.invalid
  }
  onSubmit() {
    localStorage.removeItem('TimeRemaining');
    this.showCommonError = false
    if (this.signupForm.invalid) {
      this.showCommonError = true; 
      this.signupForm.markAllAsTouched();
      return;
    }
      const { name, email, password } = this.signupForm.value as Signup;

      localStorage.setItem('name',name)
      localStorage.setItem('email',email)
      localStorage.setItem('password',password)

      this.authService.checkUserExists(email).subscribe(
        (userExists) => {
          if (userExists) {
            this.toastr.error('User with this email already exists!');
          } else {
            this.authService.sendOtp(email).subscribe(
              () => {
                this.router.navigate([`/${this.lang}/${this.theme}/otp`]);
              },
              (otpError) => {
                console.error('Error sending OTP:', otpError);
                this.toastr.error('Failed to send OTP. Please try again.');
              }
            );
          }
        },
        (error) => {
          console.error('Error checking user existence:', error);
          alert('An error occurred while checking user existence.');
        }
      );
    
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.invalid && (control.touched || control.dirty));
  }

  back(){
    this.location.back();
  }
  
}
