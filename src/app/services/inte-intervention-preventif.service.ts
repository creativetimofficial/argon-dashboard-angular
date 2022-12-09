import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class InterventionPreventifService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  getAllInterventionPreventifs(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/interventionPreventifs", { headers });
  }
  getInterventionPreventif(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/interventionPreventifs/"+id, { headers })
  }
  updateInterventionPreventif(id,interventionPreventif){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.put(environment.url+"/api/interventionPreventifs/"+id,interventionPreventif, { headers })
  }
  addInterventionPreventif(interventionPreventif:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.post(environment.url+"/api/interventionPreventifs",interventionPreventif, { headers });
  }
  deleteInterventionPreventif(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.delete(environment.url+"/api/interventionPreventifs/"+id, { headers })
  }
}
