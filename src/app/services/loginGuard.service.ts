import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn:'root'
})

export class LoginGuard implements CanActivate{
  constructor(private router: Router) {}



  canActivate(router:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {
    const token = localStorage.getItem('authToken');
    if (token) {
      const redirectUrl = state.url; 
      this.router.navigate(['/home'], { queryParams: { returnUrl: redirectUrl } });
      return false;
    }
    return true
  }
}