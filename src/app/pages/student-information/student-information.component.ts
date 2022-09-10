import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-information',
  templateUrl: './student-information.component.html',
  styleUrls: ['./student-information.component.scss']
})
export class StudentInformationComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }



  proceedToPay(){
    this.router.navigate(['/searchstudent']);
  }





}
