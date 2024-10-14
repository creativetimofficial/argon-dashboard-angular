import { Component, OnInit } from '@angular/core';
import { CUSTODIAN_ROUTES } from '../routes';
import { RouteInfo } from 'src/app/models/util/routes.model';

@Component({
  selector: 'app-custodian-layout',
  templateUrl: './custodian-layout.component.html',
  styleUrl: './custodian-layout.component.scss'
})

export class CustodianLayoutComponent implements OnInit{
  custodianRoutes: RouteInfo[] = CUSTODIAN_ROUTES;

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

}
