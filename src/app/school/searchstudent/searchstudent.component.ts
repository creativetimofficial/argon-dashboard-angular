import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiservicesService } from 'src/app/services/apiservices.service';

interface Grades{
  classgrade:String
}
@Component({
  selector: 'app-searchstudent',
  templateUrl: './searchstudent.component.html',
  styleUrls: ['./searchstudent.component.scss']
})
export class SearchstudentComponent implements OnInit {
  
  
  constructor(private service:ApiservicesService,private cookieService:CookieService,
    private router:Router) { }
  
  ngOnInit(): void {
  this.searchStudent();
  console.log('The date of birth is',this.cookieService.get('student_dob'));
  }

  grades: Grades[] = [
    {classgrade: 'FORM_ONE'},
    {classgrade: 'FORM_TWO'},
    {classgrade: 'FORM_THREE'},
  ];

  //to display our error message
  errormessage:any;
    StudentForm=new FormGroup({
    fullname:new FormControl('',[Validators.required]),
    classgrade:new FormControl('',[Validators.required])
  })
    
  
  searchStudent(){
    if(this.StudentForm.valid){
    //post to the backend server using our service
    this.service.searchStudentinfo(this.StudentForm.value).subscribe({
     next:(data)=>{
      console.log(data.body.founduser.dob)
      //let store our found users date of birth in cookies
     this.cookieService.set('student_dob', data.body.founduser.dob);

      this.router.navigate(['/searchdate'])
    },
    error:(error)=>{
      console.log(error.error.message)
      this.errormessage=error.error.message;
   
    },
   complete:()=>{console.info('Search has been completed')}
    })
    }
  }


}


