import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';



import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { CamionComponent, DialogCamion, EditDialogCamion } from './pages/camion/camion.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChauffeurComponent, DialogChauffeur } from './pages/chauffeur/chauffeur.component';


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
    DialogChauffeur
    
  ],
  providers: [],
  entryComponents:[
    DialogCamion,
    EditDialogCamion,
    DialogChauffeur
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
