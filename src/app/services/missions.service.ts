import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TokenStorageService } from './token-storage.service';
 
@Injectable({
  providedIn: 'root'
})
export class MissionsService {

  constructor(private http: HttpClient ,private token: TokenStorageService) { }
  
  getAllMissions(){
    let headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + this.token.getToken())
  .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/missions", { headers });
  }
  getMission(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.get(environment.url+"/api/missions/"+id, { headers })
  }
  updateMission(id,mission){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.put(environment.url+"/api/missions/"+id,mission, { headers })
  }
  addMission(mission:any){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    
    return this.http.post(environment.url+"/api/missions",mission, { headers });
  }
  deleteMission(id){
    let headers = new HttpHeaders()
    .set('Authorization', 'Bearer ' + this.token.getToken())
    .set('Content-Type', 'application/json');
    return this.http.delete(environment.url+"/api/missions/"+id, { headers })
  }
}
