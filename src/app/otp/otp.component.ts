//This is the OtpComponent for handles the otp input, verify the entered input
//AbstractControl - Parent class for form controls, useful for common validations.
//ActivatedRoute - Accesses route parameters like lang and theme.

import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})

export class OtpComponent {
  otpForm: FormGroup;
  lang: string = 'en';
  theme: string = 'blue'
  timer: number = 60
  interval: any;
  isVerifyButtonDisabled: boolean = false

  constructor(private authService: AuthService, private router: Router, private location: Location, private activatedRoute: ActivatedRoute, private toastr: ToastrService) {

    this.otpForm = new FormGroup({
      otp1: new FormControl('', [Validators.required, Validators.pattern('^[0-9]$')]),
      otp2: new FormControl('', [Validators.required, Validators.pattern('^[0-9]$')]),
      otp3: new FormControl('', [Validators.required, Validators.pattern('^[0-9]$')]),
      otp4: new FormControl('', [Validators.required, Validators.pattern('^[0-9]$')])
    });
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => { //Subscribes to route parameters (lang and theme) and updates the component's lang and theme properties.
      this.lang = params['lang'] || 'en';
      this.theme = params['theme'] || 'blue'
      console.log('Language in LoginComponent:', this.lang);
    });
    this.startTimer()
  }

  // Getters for form controls
  get otp1() {
    return this.otpForm.get('otp1');
  }

  get otp2() {
    return this.otpForm.get('otp2');
  }

  get otp3() {
    return this.otpForm.get('otp3');
  }

  get otp4() {
    return this.otpForm.get('otp4');
  }

  isOtpInvalid(control: AbstractControl | null): boolean {
    return control ? control.touched && control.invalid : false;
  }

  startTimer() {
    const storedTime = localStorage.getItem('TimeRemaining')
    if (storedTime) {
      this.timer = Number(storedTime);
      if (this.timer === 0) {
        this.isVerifyButtonDisabled = true;
        return
      }
    } else {
      localStorage.setItem('TimeRemaining', this.timer.toString())
    }

    this.interval = setInterval(() => {
      const timer = localStorage.getItem('TimeRemaining')
      if (Number(timer) > 0) {
        this.timer--
        localStorage.setItem('TimeRemaining', this.timer.toString())
      } else {
        this.isVerifyButtonDisabled = true
        clearInterval(this.timer)
      }
    }, 1000)

  }


  onSubmit() {
    if (this.otpForm.valid) {
      const otp = `${this.otpForm.value.otp1}${this.otpForm.value.otp2}${this.otpForm.value.otp3}${this.otpForm.value.otp4}`;
      const email = localStorage.getItem('email') || '';
      const password = localStorage.getItem('password') || '';
      const name = localStorage.getItem('name') || '';

      this.authService.verifyOtp(otp, name, email, password).subscribe(
        (response) => {
          if (response) {
            localStorage.removeItem('TimeRemaining');
            localStorage.removeItem('email');
            localStorage.removeItem('name');
            localStorage.removeItem('password');
            const successMessage = response.message;
            this.toastr.success(successMessage);
            this.router.navigate([`${this.lang}/${this.theme}/verified`]);
          }
        },
        (error) => {
          this.toastr.error(error.message );
          console.error('Error verifying OTP:', error);
        }
      );
    } else {
      this.toastr.warning('Please fill out the OTP correctly.');
    }
  }




  resendOtp() {
    localStorage.removeItem('TimeRemaining')
    const email = localStorage.getItem('email');
    if (email) {
      this.authService.sendOtp(email).subscribe(
        () => {
          this.toastr.success('OTP sent again!');
          this.timer = 60;
          this.isVerifyButtonDisabled = false;
          this.startTimer();
        },
        (error) => {
          console.error('Error sending OTP:', error);
          alert('Failed to resend OTP.');
        }
      );
    }
  }

  back() {
    this.location.back()
  }
}
