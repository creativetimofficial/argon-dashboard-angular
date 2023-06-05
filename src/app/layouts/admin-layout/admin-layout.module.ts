import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { WorkflowsComponent } from '../../pages/workflows/workflows.component';
import { DocumentsComponent } from '../../pages/documents/documents.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
// import { ToastrModule } from 'ngx-toastr';
import { AddWorkflowFormComponent } from '../../pages/workflows/add-workflow-form/add-workflow-form.component';
import { ListComponent } from '../../pages/workflows/list/list.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  imports: [
    NgxExtendedPdfViewerModule,
    NgxDocViewerModule,
    NgxPaginationModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent, 
    WorkflowsComponent,
    DocumentsComponent,
    AddWorkflowFormComponent,
    ListComponent
  ]
})

export class AdminLayoutModule {}
