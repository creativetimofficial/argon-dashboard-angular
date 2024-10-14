import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { ToastComponent } from 'src/app/components/modal/toast/toast.component';
import { ToastService } from 'src/app/components/modal/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  user: User = {
    idNo: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    role: 'student'
  };
  
  errorMessage = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  @ViewChild(ToastComponent) toastComponent!: ToastComponent;

  constructor(
    private firestoreService: FirestoreService, 
    private toastr: ToastrService, 
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.user = { idNo: '', password: '', firstName: '', lastName: '', email: '', phone: '', role: 'student' };
  }

  ngAfterViewInit() {
    this.toastService.registerToast(this.toastComponent);
  }

  register() {
    this.firestoreService.addUser(this.user)
      .then(() => {
        this.toastService.showToast("User registered successfully", 'success');
        console.log('User registered successfully');
        this.resetForm(); // Clear form
        this.router.navigate(['/auth/login']);
      })
      .catch((error) => {
        console.error('Error registering user:', error);
        this.errorMessage = 'Registration failed';
        this.toastService.showToast("Registration failed", 'error');
      });
  }

  validateForm(): boolean {
    if (!Object.values(this.user).every(field => field.trim() !== '')) {
      this.errorMessage = 'Please fill in all fields';
      this.toastr.error(this.errorMessage);
      return false;
    }
    
    if (this.user.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      this.errorMessage = 'Passwords do not match';
      this.toastr.error(this.errorMessage);
      return false;
    }
    
    this.passwordMismatch = false;
    return true;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm() && form.valid) {
      this.register();
    }
  }

  resetForm() {
    this.user = { idNo: '', password: '', firstName: '', lastName: '', email: '', phone: '', role: 'student' };
    this.confirmPassword = '';
  }
}
