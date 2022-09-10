import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import {MatSelectModule} from '@angular/material/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { SearchstudentComponent } from './school/searchstudent/searchstudent.component';
import { DateOfBirthComponent } from './pages/date-of-birth/date-of-birth.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StudentInformationComponent } from './pages/student-information/student-information.component';




@NgModule({
  imports: [
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MatNativeDateModule,
  ],
  exports: [
    MatDatepickerModule, 
    MatNativeDateModule 
],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    SearchstudentComponent,
    DateOfBirthComponent,
    StudentInformationComponent,
   
  ],
  providers: [
    CookieService,
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
