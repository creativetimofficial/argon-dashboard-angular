import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/utilisateur.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = `${environment.apiBaseUrl}/users`

  constructor(private http: HttpClient) { }

  createUser(user: any) {
    return this.http.post(this.apiURL+'/add', user).subscribe(response => 
      console.log(response)
    )
  }

  listUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURL+'/all')
  }

  updateUser(id: number, user: any) {
    return this.http.put(this.apiURL+`/${id}`, user).subscribe(response => 
        console.log(response)
      )
  }

  deleteUserById(id: number) {
    return this.http.get<User>(this.apiURL)
  }

  deleteUser() {}
}
