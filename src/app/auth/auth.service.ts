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

  setAuthTimer(durationSeconds: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, durationSeconds * 1000);
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
       this.setAuthTimer(expiresInSeconds);
        this.isAuthenticated = true;
        this.authStatusListner.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInSeconds * 1000);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
     }
    });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresInSeconds = (authInfo.expirationDate.getTime() - now.getTime()) / 1000;
    if (expiresInSeconds > 0) {
      console.log('you already logged in and have token');
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresInSeconds);
      this.authStatusListner.next(true);
      console.log(expiresInSeconds);
    }
  }

  logout() {
    console.log('logging out');
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }
}
