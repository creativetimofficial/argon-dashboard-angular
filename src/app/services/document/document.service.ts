import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Document } from 'src/app/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiURL = `${environment.apiBaseUrl}/files`

  constructor(private http: HttpClient) { }

  getFiles(): Observable<Document[]> {
    return this.http.get<Document[]>(this.apiURL+'/all');
  }

  getFileById(id:number): Observable<Document> {
    return this.http.get<Document>(this.apiURL+`/${id}`)
  }

  getFileByName(fileName: string): Observable<Document> {
    return this.http.get<Document>(this.apiURL+`/view/${fileName}`)
  }

  uploadFile(formData: FormData) {
    this.http.post(this.apiURL+"/uploadM", formData).subscribe(response => {
      console.log(response);
    })
  }

  deleteFile(id: number): Observable<Document> {
    return this.http.get<Document>(this.apiURL+`/delete/${id}`)
  }

  updateFile(id: number) {}
}
