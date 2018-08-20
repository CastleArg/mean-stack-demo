import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
import { Subject } from '../../../node_modules/rxjs';
import { Router } from '../../../node_modules/@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private authStatusListner = new Subject<boolean>();
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {}

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
    this.http.post<{token: string, expiresIn: number}>(`${environment.apiUrl}/user/login`, authData)
    .subscribe(res => {
     const token = res.token;
     this.token = token;
     if (token) {
       const expiresInSeconds = res.expiresIn;
       this.tokenTimer = setTimeout(() => {
         this.logout();
       }, expiresInSeconds * 1000);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
        this.router.navigate(['/']);
     }
    });
  }

  logout() {
    console.log('logging out');
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/login']);
  }

}
