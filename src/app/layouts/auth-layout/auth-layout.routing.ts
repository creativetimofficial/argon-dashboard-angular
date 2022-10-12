import { Routes } from '@angular/router';

import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';
import {MapsComponent} from '../../pages/maps/maps.component';
import {CheckComponent} from '../../pages/Check/check.component';

export const AuthLayoutRoutes: Routes = [
    { path: 'login',          component: LoginComponent },
    { path: 'register',       component: RegisterComponent },
    { path: 'quizz',          component: MapsComponent },
    { path: 'ok',             component: CheckComponent }

];
