import { Routes } from '@angular/router';
import { OtpComponent } from './otp/otp.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifiedComponent } from './verified/verified.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/authGuard.service';

export const routes: Routes = [
  { path: ':lang/:theme/login', component: LoginComponent },
  { path: ':lang/:theme/signup', component: SignupComponent },
  { path: ':lang/:theme/otp', component: OtpComponent },
  { path: ':lang/:theme/verified', component: VerifiedComponent },
  { path: ':lang/:theme/home', component: HomeComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: '/en/blue/login', pathMatch: 'full'},
  { path: '**', redirectTo: '/en/blue/login'}

];
