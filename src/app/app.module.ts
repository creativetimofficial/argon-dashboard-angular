import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpHeaders, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';



import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CamionComponent, DialogCamion, EditDialogCamion } from './pages/camion/camion.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthInterceptor, authInterceptorProviders } from './pages/helpers/auth.interceptor';
import { DialogChauffeur, EditDialogChauffeur } from './pages/chauffeur/chauffeur.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    MatDialogModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DialogCamion,
    EditDialogCamion,
    DialogChauffeur,
    EditDialogChauffeur
    
  ],
  providers: [    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, 
    { provide: 'HEADERS', useValue: new HttpHeaders({'Content-Type': 'application/json'})}
  ],
  entryComponents:[
    DialogCamion,
    EditDialogCamion,
    DialogChauffeur,
    EditDialogChauffeur
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
