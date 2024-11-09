import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReservationRequest } from '../models/request/reservation-request.model';
import { ReservationResponse } from '../models/response/reservation-response.model';

/**
 * Servicio encargado de manejar las operaciones relacionadas con las reservas.
 * Proporciona métodos para crear, obtener por cliente y obtener por ID las reservas desde el backend.
 */
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible de forma global en la aplicación.
})
export class ReservationService {

  // URL base para los endpoints relacionados con las reservas, definida en la configuración del entorno.
  private baseUrl: string = `${environment.HOST}/reservations`;

  // Inyección del HttpClient de Angular para realizar solicitudes HTTP.
  private http = inject(HttpClient);

  /**
   * Crea una nueva reserva.
   * @param reservationRequest Objeto que contiene los datos de la reserva a crear.
   * @returns Un observable con la respuesta que incluye los detalles de la reserva creada.
   */
  createReservation(reservationRequest: ReservationRequest): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(`${this.baseUrl}`, reservationRequest);
  }

  /**
   * Obtiene todas las reservas asociadas al cliente actual.
   * @returns Un observable con una lista de reservas del cliente.
   */
  getReservationsByClientId(): Observable<ReservationResponse[]> {
    return this.http.get<ReservationResponse[]>(`${this.baseUrl}/my-reservations`);
  }

  /**
   * Obtiene los detalles de una reserva específica por su ID.
   * @param id El ID de la reserva a obtener.
   * @returns Un observable con la respuesta que contiene los detalles de la reserva.
   */
  getReservationById(id: number): Observable<ReservationResponse> {
    return this.http.get<ReservationResponse>(`${this.baseUrl}/${id}`);
  }

}