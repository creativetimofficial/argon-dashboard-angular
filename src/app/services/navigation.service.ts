import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private authService: AuthService, private router: Router) {}

  // Redirect based on the user's role
  redirectBasedOnRole(role: string | null) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'student':
        this.router.navigate(['/student/products']);
        break;
      case 'custodian':
        this.router.navigate(['/custodian/orders']);
        break;
      case 'accountant':
          this.router.navigate(['/accountant/transactions']);
          break;
      default:
        this.router.navigate(['/auth/login']);
    }
  }

  // Redirect user if already logged in
  redirectIfLoggedIn() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getUserRole();
      this.redirectBasedOnRole(role);
    }
  }
}
