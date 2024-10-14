import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { ToastrModule } from "ngx-toastr";
import { StudentLayoutComponent } from "./layouts/student-layout/student-layout.component";
import { CustodianLayoutComponent } from "./layouts/custodian-layout/custodian-layout.component";
import { NgxSpinnerModule } from "ngx-spinner";import { AccountantLayoutComponent } from './layouts/accountant-layout/accountant-layout.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule.forRoot(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    StudentLayoutComponent,
    CustodianLayoutComponent,
    AccountantLayoutComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
