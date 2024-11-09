import { Injectable } from '@angular/core';
import { AuthResponse } from '../models/response/auth-response.model';


@Injectable({
  providedIn: 'root' // Indica que este servicio está disponible en toda la aplicación Angular.
})
export class StorageService {
  private authKey = 'restaurant_reservation_auth'; 
  // Clave utilizada para almacenar los datos de autenticación en el almacenamiento local (localStorage).

  constructor() {} 
  // Constructor vacío. No se necesita ninguna dependencia para este servicio.

  /**
   * Almacena los datos de autenticación en el almacenamiento local.
   * @param data - Los datos de autenticación que serán guardados (de tipo AuthResponse).
   */
  setAuthData(data: AuthResponse): void {
    localStorage.setItem(this.authKey, JSON.stringify(data)); 
    // Convierte el objeto de datos en una cadena JSON y lo guarda en localStorage con la clave `authKey`.
  }

  /**
   * Recupera los datos de autenticación del almacenamiento local.
   * @returns Los datos de autenticación como un objeto `AuthResponse`, o null si no existen.
   */
  getAuthData(): AuthResponse | null {
    const data = localStorage.getItem(this.authKey); 
    // Obtiene los datos almacenados en localStorage con la clave `authKey`.
    return data ? JSON.parse(data) as AuthResponse : null; 
    // Si existen datos, los convierte de JSON a un objeto `AuthResponse`. Si no, devuelve null.
  }

  /**
   * Elimina los datos de autenticación del almacenamiento local.
   */
  clearAuthData(): void {
    localStorage.removeItem(this.authKey); 
    // Remueve la entrada asociada a la clave `authKey` del localStorage.
  }
}