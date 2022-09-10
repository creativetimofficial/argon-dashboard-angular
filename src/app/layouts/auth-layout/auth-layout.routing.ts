import { Routes } from '@angular/router';
import { SearchstudentComponent } from 'src/app/school/searchstudent/searchstudent.component';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    {path:'searchstudent',component:SearchstudentComponent
}

];
