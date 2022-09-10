import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-date-of-birth',
  templateUrl: './date-of-birth.component.html',
  styleUrls: ['./date-of-birth.component.scss']
})


export class DateOfBirthComponent implements OnInit {

 
  constructor(private Cookie:CookieService,private router:Router) { }
  errormessage:any;
  dateOfBirth:any=String;
  checkDate:any=String;
  StudentDateOfBirth=new FormGroup({
    dob:new FormControl('',[Validators.required])
  })
  ngOnInit(): void {
    //get the date of birth
   this.dateOfBirth=this.Cookie.get('student_dob');
   

  }
  selectDob(){
    //check whether selected date is valid as date in our database;
  this.checkDate=this.StudentDateOfBirth.value.dob;
   
  function Sortdate(date: any){
    let a=date;

let b=a.slice(0,4)
'2000'
let c= a.slice(5,7)
'05'

let d= a.slice(8,11)

let e=d +"-"+c+"-"+b;
return e;
  }
 console.log(this.checkDate)
 console.log('our dob',this.dateOfBirth)
 console.log('our new date is',Sortdate(this.checkDate))
  if(this.dateOfBirth==Sortdate(this.checkDate)){
    this.router.navigate(['/dashboard'])
  }
  else{
    console.log('wrong')
    this.errormessage="Invalid date of birth provided";
  }
  

  }

}