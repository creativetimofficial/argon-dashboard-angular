import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/utilisateur.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private apiURL = `${environment.apiBaseUrl}/workflows`

  constructor(private http: HttpClient) { }

  createWorkflow(workflow: any) {
    return this.http.post(this.apiURL+'/start', workflow)
  }
}



  