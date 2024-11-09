import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PaypalCaptureResponse } from '../models/response/paypal-capture-response.model';
import { environment } from '../../../environments/environment';
import { PaypalOrderResponse } from '../models/response/paypal-order-response.model';

/**
 * Servicio encargado de manejar las operaciones de checkout con PayPal, como la creación y captura de órdenes.
 * Utiliza HttpClient para comunicarse con la API del backend.
 */
@Injectable({
  providedIn: 'root' // Marca el servicio como disponible en toda la aplicación sin necesidad de registrarlo manualmente.
})
export class CheckoutService {

  // URL base para los endpoints relacionados con PayPal, definida en la configuración del entorno.
  private baseUrl: string = `${environment.HOST}/checkout/paypal`;

  // Inyección del HttpClient de Angular para realizar solicitudes HTTP.
  private http = inject(HttpClient);

  /**
   * Crea una orden de PayPal para una reserva específica.
   * @param reservationId - El ID de la reserva asociada con la orden de PayPal.
   * @returns Un observable con la respuesta de creación de la orden de PayPal desde el backend.
   */
  createPaypalOrder(reservationId: number) {
    let params = new HttpParams();
    params = params.append('reservationId', reservationId); // Agrega el ID de la reserva como un parámetro de consulta.
    params = params.append('returnUrl', environment.paypalReturnUrl); // Agrega la URL de retorno para transacciones exitosas.
    params = params.append('cancelUrl', environment.paypalReturnUrl); // Agrega la URL de cancelación para transacciones fallidas o canceladas.
    return this.http.post<PaypalOrderResponse>(`${this.baseUrl}/create`, null, { params: params });
  }

  /**
   * Captura una orden de PayPal por su ID.
   * @param orderId - El ID de la orden de PayPal que se desea capturar.
   * @returns Un observable con la respuesta de captura desde el backend.
   */
  capturePaypalOrder(orderId: string) {
    let params = new HttpParams();
    params = params.append('orderId', orderId); // Agrega el ID de la orden como un parámetro de consulta.
    return this.http.post<PaypalCaptureResponse>(`${this.baseUrl}/capture`, null, { params: params });
  }

}