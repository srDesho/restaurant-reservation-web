import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DistrictResponse } from '../models/response/district-response.model';

/**
 * Servicio encargado de manejar las operaciones relacionadas con los distritos.
 * Utiliza HttpClient para obtener datos desde el backend.
 */
@Injectable({
  providedIn: 'root' // Marca el servicio como disponible en toda la aplicación sin necesidad de registrarlo manualmente.
})
export class DistrictService {

  // URL base para los endpoints relacionados con los distritos, definida en la configuración del entorno.
  private baseUrl: string = `${environment.HOST}/districts`;

  // Inyección del HttpClient de Angular para realizar solicitudes HTTP.
  private http = inject(HttpClient); 
  
  /**
   * Obtiene una lista de todos los distritos desde el backend.
   * @returns Un observable con la respuesta que contiene la lista de distritos.
   */
  getAllDistricts(): Observable<DistrictResponse[]> {
    return this.http.get<DistrictResponse[]>(this.baseUrl);
  }
}