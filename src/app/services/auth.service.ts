import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
 user:String;
  login(email: string, password: string): Observable<any> {
    this.user=email;
    console.log(email,password);
    return this.http.post(AUTH_API + 'login', {
      email,
      password
    }, httpOptions);
  }
  getUser(){
     console.log(this.user);
    return this.user ;
  }

  register(username: string, email: string, password: string): Observable<any> {
    console.log(username,email,password);

    return this.http.post(AUTH_API + 'register', {
      username,
      email,
      password
    }, httpOptions);
  }
}