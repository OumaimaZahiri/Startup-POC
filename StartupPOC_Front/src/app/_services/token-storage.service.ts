import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const PHOTO_USER_KEY = 'photo-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }
   
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }

  public savePhoto(photo: string): void {
    window.sessionStorage.removeItem(PHOTO_USER_KEY);
    window.sessionStorage.setItem(PHOTO_USER_KEY, JSON.stringify(photo));
  }

  public getPhoto(): any {
    const photo = window.sessionStorage.getItem(PHOTO_USER_KEY);
    if (photo) {
      return JSON.parse(photo);
    }
    return {};
  }

}
