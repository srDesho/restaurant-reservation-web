import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { CheckoutService } from '../../../../shared/services/checkout.service';
import { ReservationResponse } from '../../../../shared/models/response/reservation-response.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * Esta clase es responsable de mostrar la confirmación de una reserva realizada.
 * Se encarga de cargar los detalles de la reserva a través de un servicio y ofrece
 * opciones al usuario para continuar navegando o revisar los detalles de la reserva.
 */
@Component({
  selector: 'app-reservation-confirmation',
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './reservation-confirmation.component.html',
  styleUrl: './reservation-confirmation.component.css'
})
export class ReservationConfirmationComponent {

  private route = inject(ActivatedRoute);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  reservation!: ReservationResponse; 
  reservationIdStr!: string;
  
  loading = false;

  /**
   * Método del ciclo de vida de Angular que se ejecuta al inicializar el componente.
   * Recupera el ID de la reserva almacenado en el localStorage, si existe, y carga los detalles
   * de la reserva correspondiente.
   */
  ngOnInit(): void {    
    const reservationId = localStorage.getItem('reservationId');   

    if (reservationId) {
      this.loadReservationDetails(+reservationId);  // Convertir a número si es necesario
      localStorage.removeItem('reservationId'); // Eliminar el ID después de cargar los datos
    }
  }

  /**
   * Carga los detalles de una reserva a partir de su ID.
   * @param reservationId ID de la reserva a cargar.
   */
  loadReservationDetails(reservationId: number): void {
    this.reservationService.getReservationById(reservationId).subscribe({
      next: (reservation) => {
        this.reservation = reservation;        
      },
      error: () => this.showSnackBar('Failed to load reservation details!')
    });
  }

  /**
   * Getter para obtener el usuario actualmente autenticado.
   */
  get user() {
    return this.authService.getCurrentUser();
  }

  /**
   * Navega al catálogo de restaurantes para continuar navegando.
   */
  onContinueShopping(): void {
    this.router.navigate(['/pages/restaurants']);
  }

  /**
   * Muestra un mensaje tipo SnackBar en la parte inferior de la pantalla.
   * @param message Mensaje a mostrar.
   */
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
