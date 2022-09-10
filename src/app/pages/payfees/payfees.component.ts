import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


interface SchedulePayment{
  payment:String
}
@Component({
  selector: 'app-payfees',
  templateUrl: './payfees.component.html',
  styleUrls: ['./payfees.component.scss']
})


export class PayfeesComponent implements OnInit {

  schedules:SchedulePayment[]=[
    {payment:"Full Payment"},
    {payment:"Half Payment"}

  ]

  
  errormessage:any;
  constructor() { }

  ngOnInit(): void {
  }

      payfeesForm=new FormGroup({
      fullname:new FormControl('',Validators.required),
      classgrade:new FormControl('',Validators.required)
    })
  

  

 




}
