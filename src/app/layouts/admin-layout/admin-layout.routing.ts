import { Routes } from "@angular/router";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { IconsComponent } from "../../pages/icons/icons.component";
import { MapsComponent } from "../../pages/maps/maps.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { TablesComponent } from "../../pages/tables/tables.component";
import { WorkflowsComponent } from "src/app/pages/workflows/workflows.component";
import { DocumentsComponent } from "src/app/pages/documents/documents.component";
import { InitiateFlowComponent } from "src/app/pages/workflows/initiate-flow/initiate-flow.component";
import { SignatureComponent } from "src/app/pages/signature/signature.component";
import { SitesComponent } from "src/app/pages/sites/sites.component";
import { UpdateFlowComponent } from "src/app/pages/workflows/update-flow/update-flow.component";
import { UpdateTaskComponent } from "src/app/pages/workflows/update-task/update-task.component";
import { UsersComponent } from "src/app/pages/users/users.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "documents", component: DocumentsComponent },
  { path: "users", component: UsersComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "workflows", component: WorkflowsComponent },
  { path: "workflows/:list", component: InitiateFlowComponent },
  { path: "workflows/list/:id", component: InitiateFlowComponent },
  { path: "signature", component: SignatureComponent },
  { path: "equipes", component: SitesComponent },
  { path: "workflows/update-flow/:id", component: UpdateFlowComponent },
  { path: "workflows/update-task/:id", component: UpdateTaskComponent },
  //{ path: 'tables',         component: TablesComponent },
  //{ path: 'icons',          component: IconsComponent },
  //{ path: 'maps',           component: MapsComponent },
];
