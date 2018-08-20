import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
import { Subject } from '../../../node_modules/rxjs';
import { ThrowStmt } from '../../../node_modules/@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getToken(): string {
    return this.token;
  }

  getAuthStatusListner() {
    return this.authStatusListner.asObservable();
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post(`${environment.apiUrl}/user/signup`, authData)
    .subscribe(res => {
      console.log(res);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };
    this.http.post<{token: string}>(`${environment.apiUrl}/user/login`, authData)
    .subscribe(res => {
     const token = res.token;
     this.token = token;
     if (token) {
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
     }
    });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
  }

}
