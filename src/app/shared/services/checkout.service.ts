import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { PaypalCaptureResponse } from '../models/response/paypal-capture-response.model';
import { environment } from '../../../environments/environment';
import { PaypalOrderResponse } from '../models/response/paypal-order-response.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl:string = `${environment.HOST}/checkout/paypal`;
  private http = inject(HttpClient);

  createPaypalOrder(reservationId: number) {
    let params = new HttpParams();
    params = params.append('reservationId', reservationId);
    params = params.append('returnUrl', environment.paypalReturnUrl);
    params = params.append('cancelUrl', environment.paypalReturnUrl);
    return this.http.post<PaypalOrderResponse>(`${this.baseUrl}/create`,null, { params: params });
  }
  
  capturePaypalOrder(orderId: string) {
    let params = new HttpParams();
    params = params.append('orderId', orderId);
    return this.http.post<PaypalCaptureResponse>(`${this.baseUrl}/capture`, null,{ params: params });
  }

}
