import { Injectable } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FactureService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  getAllFactures(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/factures", { headers });
  }
  getFacture(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/factures/"+id, { headers })
  }
  updateFacture(id,facture){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.put(environment.url+"/api/factures/"+id,facture, { headers })
  }
  addFacture(facture:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.post(environment.url+"/api/factures",facture, { headers });
  }
  deleteFacture(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.delete(environment.url+"/api/factures/"+id, { headers })
  }
}

