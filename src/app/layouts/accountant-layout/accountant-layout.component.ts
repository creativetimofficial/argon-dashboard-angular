import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'src/app/models/util/routes.model';
import { ACCOUNTANT_ROUTES } from '../routes';

@Component({
  selector: 'app-accountant-layout',
  templateUrl: './accountant-layout.component.html',
  styleUrl: './accountant-layout.component.scss'
})
export class AccountantLayoutComponent implements OnInit{
  
  accountantRouteInfo: RouteInfo[] = ACCOUNTANT_ROUTES;

  constructor() { }

  ngOnInit() {

  }
}
