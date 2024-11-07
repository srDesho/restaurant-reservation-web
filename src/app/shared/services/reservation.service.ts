import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReservationRequest } from '../models/request/reservation-request.model';
import { ReservationResponse } from '../models/response/reservation-response.model';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private baseUrl:string = `${environment.HOST}/reservations`;
  private http = inject(HttpClient);
  
  createReservation(reservationRequest: ReservationRequest): Observable<ReservationResponse> {
      return this.http.post<ReservationResponse>(`${this.baseUrl}`, reservationRequest);
  }


  getReservationsByClientId(): Observable<ReservationResponse[]> {
      return this.http.get<ReservationResponse[]>(`${this.baseUrl}/my-reservations`);
  }

  
  getReservationById(id: number): Observable<ReservationResponse> {
     return this.http.get<ReservationResponse>(`${this.baseUrl}/${id}`);
  }  
  
}
