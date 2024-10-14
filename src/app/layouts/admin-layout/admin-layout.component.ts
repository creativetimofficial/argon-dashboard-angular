import { Component, OnInit } from '@angular/core';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { RouteInfo } from 'src/app/models/util/routes.model';
import { ADMIN_ROUTES } from '../routes';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  adminRoutes:RouteInfo[] = ADMIN_ROUTES;

  constructor() { }

  ngOnInit() {
  }

}
