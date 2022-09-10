import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutRoutes } from './auth-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { PayfeesComponent } from 'src/app/pages/payfees/payfees.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
    // NgbModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    PayfeesComponent
  ]
})
export class AuthLayoutModule { }
