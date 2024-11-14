import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { catchError } from 'rxjs';
import { of } from 'rxjs';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { MatButtonModule } from '@angular/material/button';
import { ReservationResponse } from '../../../../shared/models/response/reservation-response.model';

// Esta clase maneja la visualización del historial de reservas de un cliente.
// Se encarga de cargar y mostrar las reservas, así como de gestionar pagos con PayPal.

@Component({
  selector: 'app-reservation-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.css']
})
export class ReservationHistoryComponent implements OnInit {

  // Inyección del servicio de reservas para obtener las reservas del cliente
  private reservationService = inject(ReservationService);

  // Array para almacenar las reservas cargadas desde el servicio
  reservations: ReservationResponse[] = [];

  // Columnas que se mostrarán en la tabla de historial de reservas
  displayedColumns: string[] = ['reservationDate', 'restaurant', 'numberOfPeople', 'totalAmount', 'status'];

  // Método que se ejecuta al inicializar el componente
  // Se encarga de cargar las reservas del cliente
  ngOnInit(): void {
    this.loadReservations();
  }

  // Método que obtiene las reservas del cliente mediante el servicio
  loadReservations(): void {
    // Llama al servicio para obtener las reservas y las almacena en la propiedad 'reservations'
    this.reservationService.getReservationsByClientId()
     .subscribe(data => {
        this.reservations = data;
      });
  }

  // Método para iniciar el proceso de pago con PayPal
  // Recibe el ID de la reserva y muestra un mensaje (puede ampliarse con la lógica de pago)
  onPayWithPayPal(reservationId: number): void {
    console.log('Payment initiated for reservation ID:', reservationId);   
    // Aquí se puede agregar la lógica para procesar el pago
  }
}
