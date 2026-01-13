import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {isPlatformBrowser} from "@angular/common";

@Injectable({
  providedIn: 'root'
})

export class TokenService {
  private authTokenSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated$ = this.authTokenSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.authTokenSubject = new BehaviorSubject<boolean>(this.hasToken());
    this.isAuthenticated$ = this.authTokenSubject.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('YXV0aEFkbWluVG9rZW4=');
  }

  getToken(): boolean {
    return this.authTokenSubject.value;
  }

  setToken(token:string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    } //Base64 Encoding
    this.authTokenSubject.next(true);
  }

  clearToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
    }
    this.authTokenSubject.next(false);
  }


}
