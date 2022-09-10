import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {

  constructor(private _http: HttpClient) { }


  apiUrl="http://localhost:4000/getallusers/getallusers";
  employeeUrl="http://localhost:4000/employeeperformance/employeeperformance";
  deleteuserUrl="http://localhost:4000/deleteuser/deleteuser";
  createuserUrl="http://localhost:4000/createuser/createuser";
  edituserUrl="http://localhost:4000/edituser/edituser";
  getsingledataUrl="http://localhost:4000/getsingledata/getsingledata";
  getpersonaldevelopment="http://localhost:4000/personaldevelopment/personaldevelopment";
  getemployeeobjectives="http://localhost:4000/getemployeeobjectives/getemployeeobjectives";
   getsingleemployeeobjective="http://localhost:4000/getSingleemployeeobjective/getSingleemployeeobjective";
   getsinglepersonaldevelopment="http://localhost:4000/getSingleemployeeobjective/getpersonaldevelopment";
  managersendappraisal="http://localhost:4000/managersendappraisal/managersendappraisal";
  getuserlogin="http://localhost:4000/userlogin/userlogin";
  getusername="http://localhost:4000/userlogin/username";
  getsingleinfo="http://localhost:4000/finduserinfo/finduserinfo";
  adminlogin="http://localhost:4000/managerlogin/managerlogin";
  allemployeeperformance="http://localhost:4000/getallemployeeobjectives/getallemployeeobjectives";
  getallpersonaldevelopment="http://localhost:4000/getallpersonaldevelopment/getallpersonaldevelopment";
  getstudentinfo="http://localhost:4000/searchstudentinfo/searchstudentinfo";
  
  
  searchStudentinfo(data:any):Observable<any>{
    return this._http.post(`${this.getstudentinfo}`,data, {observe: 'response'});
  }

}
