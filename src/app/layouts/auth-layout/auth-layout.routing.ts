import { Routes } from '@angular/router';
import { DateOfBirthComponent } from 'src/app/pages/date-of-birth/date-of-birth.component';
import { StudentInformationComponent } from '../../pages/student-information/student-information.component';
import { SearchstudentComponent } from 'src/app/school/searchstudent/searchstudent.component';
import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import { PayfeesComponent } from 'src/app/pages/payfees/payfees.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path:'searchstudent',   component:SearchstudentComponent},
    { path:'searchdate',      component:DateOfBirthComponent},
    { path:'studentinfo',     component:StudentInformationComponent},
    { path:'payfees',         component:PayfeesComponent }
    

];
