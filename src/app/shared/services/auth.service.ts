import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { AuthRequest } from '../models/request/auth-request.model';
import { AuthResponse } from '../models/response/auth-response.model';
import { environment } from '../../../environments/environment';
import { SignupRequest } from '../models/request/signup-request.model';
import { Profile } from '../models/response/profile-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseURL:string= `${environment.HOST}/auth`; 
  private http= inject(HttpClient);
  private storageService = inject(StorageService);

  // operador tap de RxJS. El operador tap se usa para ejecutar efectos secundarios, 
  //como guardar los datos de autenticación en el local storage, sin modificar los datos que se están pasando a través del observable.
  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/sign-in`, authRequest).pipe(
      tap(response => this.storageService.setAuthData(response)) 
    );
  }

  signup(signupRequest: SignupRequest): Observable<Profile> {
    return this.http.post<Profile>(`${this.baseURL}/sign-up`, signupRequest);
  }

  logout(): void {
    this.storageService.clearAuthData();
  }

  isAuthenticated(): boolean {
    return this.storageService.getAuthData() !== null;
  }

  getCurrentUser(): Profile | null {
    const authData = this.storageService.getAuthData();
    return authData ? authData.user : null;
  }
}
