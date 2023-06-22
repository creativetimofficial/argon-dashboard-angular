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
import { NgxPaginationModule } from 'ngx-pagination';
//import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
//import { ModalAssociateUserComponent } from './pages/workflows/modal-associate-user/modal-associate-user.component';
import { ModalAddDocumentComponent } from './pages/workflows/modal-add-document/modal-add-document.component';
import { ModalComponent } from './components/modal/modal.component';
import { DocumentAddDossierComponent } from './pages/documents/document-add-dossier/document-add-dossier.component';
import { ModalAddTaskComponent } from './pages/workflows/modal-add-task/modal-add-task.component';
//import { SignatureComponent } from './pages/signature/signature.component';
//import { SignatureListComponent } from './pages/signature/signature-list/signature-list.component';
import { SitesComponent } from './pages/sites/sites.component';
import { UpdateSiteComponent } from './pages/sites/update-site/update-site.component';
import { DeleteSiteComponent } from './pages/sites/delete-site/delete-site.component';
import { ReadSiteComponent } from './pages/sites/read-site/read-site.component';
import { AddSiteComponent } from './pages/sites/add-site/add-site.component';
import { UpdateFlowComponent } from './pages/workflows/update-flow/update-flow.component';
import { UpdateTaskComponent } from './pages/workflows/update-task/update-task.component';
import { UsersComponent } from './pages/users/users.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { AddUserFormComponent } from './pages/users/add-user-form/add-user-form.component';
import { ModalDeleteComponent } from './pages/users/user-list/modal-delete/modal-delete.component';
import { ModalDetailComponent } from './pages/users/user-list/modal-detail/modal-detail.component';
import { ModalUpdateComponent } from './pages/users/user-list/modal-update/modal-update.component';
//import { SignerComponent } from './pages/signature/signer/signer.component';
//import { StepsFlowComponent } from './pages/workflows/steps-flow/steps-flow.component';
//import { DocumentViewFileModalComponent } from './pages/documents/document-view-file-modal/document-view-file-modal.component';

//import { AddWorkflowFormComponent } from './pages/workflows/add-workflow-form/add-workflow-form.component';
//import { ListComponent } from './pages/workflows/list/list.component';


@NgModule({
  imports: [
    NgxExtendedPdfViewerModule,
    // NgxDocViewerModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    //ModalAssociateUserComponent,
    ModalAddDocumentComponent,
    ModalComponent,
    DocumentAddDossierComponent,
    ModalAddTaskComponent,
    SitesComponent,
    UpdateSiteComponent,
    DeleteSiteComponent,
    ReadSiteComponent,
    AddSiteComponent,
    UpdateFlowComponent,
    UpdateTaskComponent,
    UsersComponent,
    UserListComponent,
    AddUserFormComponent,
    ModalDeleteComponent,
    ModalDetailComponent,
    ModalUpdateComponent,
    //SignerComponent,
    //StepsFlowComponent,
    //DocumentViewFileModalComponent
    //AddWorkflowFormComponent,
    //ListComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
