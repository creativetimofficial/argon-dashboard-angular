import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { CamionComponent } from 'src/app/pages/camion/camion.component';
import { ChauffeurComponent } from 'src/app/pages/chauffeur/chauffeur.component';
import { ClientComponent } from 'src/app/pages/client/client.component';
import { MissionComponent } from 'src/app/pages/mission/mission.component';
import { FactureComponent } from 'src/app/pages/facture/facture.component';
import { InterventionPreventifComponent } from 'src/app/pages/InterventionPreventif/intervention-preventif.component';
import { InterventionCuratifComponent } from 'src/app/pages/interventionCuratif/intervention-curatif.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'camion',      component: CamionComponent},
    { path: 'chauffeur',      component: ChauffeurComponent},
    { path: 'mission',      component: MissionComponent},
    { path: 'facture',      component: FactureComponent},
    { path: 'interventionPreventif',component: InterventionPreventifComponent},
    { path: 'interventionCuratif', component: InterventionCuratifComponent},
    { path: 'client',      component: ClientComponent},
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent }
];
