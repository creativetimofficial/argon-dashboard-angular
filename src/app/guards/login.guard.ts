import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router){
    
  }
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn(); 
    const role = this.authService.getUserRole()
    
    // Check if user is trying to access the login page and is already logged in
    if (isLoggedIn && state.url === '/auth/login') {
      this.router.navigate([`/${role}/dashboard`]);
      return false;
    }
    return true;
  }
  
}
