import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'ni ni-tv-2 text-primary', class: '' },
    { path: '/icons', title: 'Icons',  icon:'ni ni-planet text-blue', class: '' },
    { path: '/user-profile', title: 'User profile',  icon:'ni ni-single-02 text-yellow', class: '' },
    { path: '/tables', title: 'Tables',  icon:'ni ni-bullet-list-67 text-red', class: '' },
    { path: '/documents', title: 'Espace documents',  icon:'ni ni-folder-17 text-blue', class: '' },
    { path: '/workflows', title: 'Workflows',  icon:'ni ni-archive-2 tet-blue', class: '' },
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
