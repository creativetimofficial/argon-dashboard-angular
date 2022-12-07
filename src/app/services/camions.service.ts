import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
 
@Injectable({
  providedIn: 'root'
})
export class CamionsService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  
  getAllCamions(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/camions", { headers });
  }
  getCamion(id){
    return this.http.get(environment.url+"/api/camions/"+id)
  }
  updateCamion(id,camion){
    return this.http.put(environment.url+"/api/camions/"+id,camion)
  }
  addCamion(camion:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.post(environment.url+"/api/camions",camion, { headers });
  }
  deleteCamion(id){
    return this.http.delete(environment.url+"/api/camions/"+id)
  }
}
