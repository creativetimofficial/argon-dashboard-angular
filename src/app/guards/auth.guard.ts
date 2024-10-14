import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const userRole = this.authService.getUserRole();
    const routePath = route.routeConfig?.path;

    if (routePath === 'logout') {
      // Handle logout
      this.authService.logout();
      this.router.navigate(['/auth/login']);
      return false; // Prevent further navigation
    }

    if (isLoggedIn) {
      // Redirect logged-in users away from login page
      if (routePath === 'auth/login') {
        this.router.navigate([`/${userRole}/dashboard`]);
        return false;
      }

      // Allow access to routes based on user role
      if (routePath === userRole) {
        return true;
      }

      // Redirect to the respective dashboard if unauthorized
      this.router.navigate([`/${userRole}/dashboard`]);
      return false;
    } else {
      // Redirect not-logged-in users to the login page
      if (routePath !== 'auth/login') {
        this.router.navigate(['/auth/login']);
      }
      return false;
    }

    // const userRole = this.authService.getUserRole(); // Retrieve the user role
    // const isLoggedIn = this.authService.isLoggedIn(); // Check if the user is logged in

    // if (isLoggedIn) {
    //   // If the user is logged in, check their role and redirect if necessary
    //   if (route.routeConfig?.path === 'student' && userRole === 'student') {
    //     return true; // Allow access to student route
    //   } else if (userRole === 'admin') {
    //     this.router.navigate(['/admin/dashboard']); // Redirect admin to admin dashboard
    //     return false; // Block the current navigation
    //   } else if (userRole === 'custodian') {
    //     this.router.navigate(['/custodian/dashboard']); // Redirect custodian to custodian dashboard
    //     return false; // Block the current navigation
    //   } else {
    //     // Handle any other roles if necessary
    //     return false;
    //   }
    // } else {
    //   // If not logged in, redirect to the login page
    //   this.router.navigate(['/auth/login']);
    //   return false; // Block access to the route
    // }
  }
  
}
