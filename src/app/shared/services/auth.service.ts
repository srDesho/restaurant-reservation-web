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
  // como guardar los datos de autenticación en el local storage, sin modificar los datos que se están pasando a través del observable.
  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/sign-in`, authRequest).pipe(
      tap(response => this.storageService.setAuthData(response)) 
    );
  }

/**
 * Service class that handles user authentication and profile management.
 * Provides methods for signing up, logging out, checking authentication status, 
 * and retrieving the current user profile.
 */
signup(signupRequest: SignupRequest): Observable<Profile> {
  return this.http.post<Profile>(`${this.baseURL}/sign-up`, signupRequest); 
  // Sends a POST request to the `sign-up` endpoint with the user's signup details.
  // Returns an Observable of the `Profile` object received from the backend.
}

logout(): void {
  this.storageService.clearAuthData(); 
  // Calls the `clearAuthData` method of `StorageService` to remove any authentication data from localStorage.
}

isAuthenticated(): boolean {
  return this.storageService.getAuthData() !== null; 
  // Checks if there is any authentication data stored in localStorage.
  // Returns `true` if the user is authenticated (data exists), or `false` otherwise.
}

getCurrentUser(): Profile | null {
  const authData = this.storageService.getAuthData(); 
  // Retrieves authentication data from `StorageService`.
  return authData ? authData.user : null; 
  // If authentication data exists, returns the user profile. Otherwise, returns null.
  }
}