import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from 'src/app/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiURL = `${environment.apiBasUrl}/files`

  constructor(private http: HttpClient) { }

  getFiles(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiURL);
  }
}
