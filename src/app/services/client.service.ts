import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
 
@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  
  getAllClients(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/clients", { headers });
  }
  getClient(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/clients/"+id, { headers })
  }
  updateClient(id,client){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.put(environment.url+"/api/clients/"+id,client, { headers })
  }
  addClient(client:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.post(environment.url+"/api/clients",client, { headers });
  }
  deleteClient(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.delete(environment.url+"/api/clients/"+id, { headers })
  }
}
