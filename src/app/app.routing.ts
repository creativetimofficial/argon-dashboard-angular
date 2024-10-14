import { CustodianLayoutModule } from './layouts/custodian-layout/custodian-layout.module';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { StudentLayoutComponent } from './layouts/student-layout/student-layout.component';
import { LoginGuard } from './guards/login.guard';
import { ItemComponent } from './components/cards/item/item.component';
import { CustodianLayoutComponent } from './layouts/custodian-layout/custodian-layout.component';
import { CheckoutComponent } from './pages/student/checkout/checkout.component';
import { AccountantLayoutComponent } from './layouts/accountant-layout/accountant-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  }, {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule)
      }
    ]
  },
  {
    path: 'student',
    component: StudentLayoutComponent,
    canActivate: [AuthGuard], // Add role guard to check if the user is a student
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/student-layout/student-layout.module').then(m => m.StudentLayoutModule)
      }
    ]
  }, 
  {
    path: 'custodian',
    component: CustodianLayoutComponent,
    canActivate: [AuthGuard], // Add role guard to check if the user is a student
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/custodian-layout/custodian-layout.module').then(m => m.CustodianLayoutModule)
      }
    ]
  },
  {
    path: 'accountant',
    component: AccountantLayoutComponent,
    canActivate: [AuthGuard], // Add role guard to check if the user is a student
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/accountant-layout/accountant-layout.module').then(m => m.AccountantLayoutModule)
      }
    ]
  }, 
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [LoginGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      },
    ]
  },

  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
