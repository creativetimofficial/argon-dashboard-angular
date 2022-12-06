import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CamionsService {

  constructor(private http: HttpClient ) { }

  getAllCamions(){
    return this.http.get(environment.url+"/api/camions")
  }
  getCamion(id){
    return this.http.get(environment.url+"/api/camions/"+id)
  }
  updateCamion(id,camion){
    return this.http.put(environment.url+"/api/camions/"+id,camion)
  }
  addCamion(camion:any){
    return this.http.post(environment.url+"/api/camions",camion)
  }
  deleteCamion(id){
    return this.http.delete(environment.url+"/api/camions/"+id)
  }
}
