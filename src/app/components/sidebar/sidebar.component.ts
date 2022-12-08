import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/mission', title: 'Mission',  icon: 'ni ni-single-copy-04 text-blue', class: '' },
  { path: '/chauffeur', title: 'Chauffeurs',  icon: 'ni ni-single-02 text-blue', class: '' },
  { path: '/camion', title: 'Camions',  icon: 'ni ni-delivery-fast text-blue', class: '' },
  { path: '/client', title: 'Clients',  icon: 'ni ni-box-2 text-blue', class: '' },
  { path: '/facture', title: 'Factures',  icon: 'ni ni-credit-card text-blue', class: '' },
  { path: '/fiche-de-paie', title: 'Fiches de paie',  icon: 'ni ni-money-coins text-blue', class: '' },
  { path: '/intervention-preventif', title: 'Intervention Preventif',  icon: 'ni ni-settings text-blue', class: '' },
  { path: '/intervention-curatif', title: 'Intervention Curatif',  icon: 'ni ni-settings text-blue', class: '' },
 ];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
