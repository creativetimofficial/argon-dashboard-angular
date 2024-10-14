import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'src/app/models/util/routes.model';
import { STUDENT_ROUTES } from '../routes';

@Component({
  selector: 'app-student-layout',
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.scss']
})
export class StudentLayoutComponent implements OnInit {
  studentRoutes: RouteInfo[] = STUDENT_ROUTES;

  constructor() { }

  ngOnInit() {

  }


}
