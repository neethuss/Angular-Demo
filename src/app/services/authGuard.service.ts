import { Injectable } from "@angular/core"; //CanActivate:An interface that defines a guard for a route
import {  CanActivate, Router } from "@angular/router";
import { SettingsService } from "./settings.service";

@Injectable({
  providedIn:'root'
})

export class AuthGuard implements CanActivate{ //canActivate method decides if the route should be accessible
  constructor(private router: Router) {}



  canActivate(): boolean {
    const token = localStorage.getItem('authToken')
    if(token){
      return true
    }else{
     this.router.navigate(['/login'])
      return true
    }

  }
}