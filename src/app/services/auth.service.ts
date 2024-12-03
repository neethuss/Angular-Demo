//This is AuthService - Handles authentication-related API calls

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private translate:TranslateService) {}

  //method for login an user
  login(credentials:{email:string, password:string}):Observable<any>{
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.backendUrl}/api/login`, credentials, { headers, withCredentials: true }).pipe(
      map((response) => {
        let successMessage = '';
      this.translate.get('success.loginSuccess').subscribe((message: string) => {
        successMessage = message;
      });
      return { ...response, message: successMessage }
      }),
      catchError(this.handleError.bind(this))
    );
  }
  
  //for checking an user is already exist (used in the singup component)
  checkUserExists(email: string): Observable<boolean> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.get<boolean>(`${this.backendUrl}/api/user?email=${email}`, { headers, withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError.bind(this))
    );
  }
  
  //for sending otp to user's email
  sendOtp(email: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.backendUrl}/api/send-otp`, { email }, { headers, withCredentials: true }).pipe(
      map((response) => {
        let successMessage = '';
      this.translate.get('success.otpSent').subscribe((message: string) => {
        successMessage = message;
      });
      return { ...response, message: successMessage }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  //for verifying the entered otp
  verifyOtp(otp: string, name: string, email: string, password: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.backendUrl}/api/verify-otp`, { otp, email, name, password }, { headers, withCredentials: true }).pipe(
      map((response) => response),
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
  
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
      console.error('Client-side error:', errorMessage);
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.error('Server-side error:', {
        status: error.status,
        body: error.error
      });
  
      if (error.status === 401) {
        this.translate.get('errors.invalidPassword').subscribe((translateMessage:string)=>{
          errorMessage = translateMessage
        })
      }else if(error.status === 404){
        this.translate.get('errors.userNotFound').subscribe((translateMessage:string)=>{
          errorMessage = translateMessage
        })
      }else if(error.status === 409){
        this.translate.get('errors.userAlreadyExists').subscribe((translateMessage:string)=>{
          errorMessage = translateMessage
        })
      }else if(error.status ===404){
        this.translate.get('errors.invalidOtp').subscribe((translateMessage:string)=>{
          errorMessage = translateMessage
        })
      }
      else{
        this.translate.get('errors.internalServerError').subscribe((translateMessage:string)=>{
          errorMessage = translateMessage
        })      }
    }
  
    return throwError(() => new Error(errorMessage)); 
  }
  
  
}
