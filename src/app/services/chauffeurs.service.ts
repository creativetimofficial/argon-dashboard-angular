import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChauffeursService {

  constructor(private http:HttpClient) { }

  getAllChauffeurs(){
    return this.http.get(environment.url+"/api/chauffeurs")
  }
  getChauffeur(id){
    return this.http.get(environment.url+"/api/chauffeurs/"+id)
  }
  updateChauffeur(id,chauffeur){
    return this.http.put(environment.url+"/api/camions/"+id,chauffeur)
  }
  addChauffeur(chauffeur:any){
    return this.http.post(environment.url+"/api/chauffeurs",chauffeur)
  }
  deleteChauffeur(id){
    return this.http.delete(environment.url+"/api/chauffeurs/"+id)
  }
}
