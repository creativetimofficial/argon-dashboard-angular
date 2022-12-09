 import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class InterventionCuratifService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  getAllInterventionCuratifs(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/interventionCuratifs", { headers });
  }
  getInterventionCuratif(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/interventionCuratifs/"+id, { headers })
  }
  updateInterventionCuratif(id,interventionCuratif){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.put(environment.url+"/api/interventionCuratifs/"+id,interventionCuratif, { headers })
  }
  addInterventionCuratif(interventionCuratif:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.post(environment.url+"/api/interventionCuratifs",interventionCuratif, { headers });
  }
  deleteInterventionCuratif(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.delete(environment.url+"/api/interventionCuratifs/"+id, { headers })
  }
}
