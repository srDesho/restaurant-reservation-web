import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { RestaurantResponse } from '../../../../shared/models/response/restaurant-response.model';
import { ReservationService } from '../../../../shared/services/reservation.service';
import { RestaurantService } from '../../../../shared/services/restaurant.service';
import { ReservationRequest } from '../../../../shared/models/request/reservation-request.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../shared/services/auth.service';
import { ReservationResponse } from '../../../../shared/models/response/reservation-response.model';
import { CheckoutService } from '../../../../shared/services/checkout.service';


@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    RouterLink, 
    RouterOutlet
  ],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private reservationService = inject(ReservationService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private restaurantService = inject(RestaurantService); 
  private authService = inject(AuthService);  
  private checkoutService = inject(CheckoutService);

  reservationForm: FormGroup;
  availableTimes: string[] = [     
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
    '18:00', '18:30', '19:00', '19:30', '20:00'
  ];

  //Uso de !  Cuando estás absolutamente seguro de que un valor no es null ni undefined
  //Uso de ? Cuando estás trabajando con objetos o valores que pueden ser null o undefined,
  restaurantId!: number;
  reservationId!: number;
  restaurant!: RestaurantResponse;
  reservation!: ReservationResponse;


  numberOfPeople = signal(1);  // Inicializamos con 1 persona por defecto
  totalAmount = computed(() => this.numberOfPeople() * this.restaurant.pricePerPerson);
  minDate: Date=new Date();

  loading = false;
  showPaypalButton = false; 
  reservationConfirmed = false;


  constructor(){
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      reservationTime: ['', Validators.required],      
      numberOfPeople: [this.numberOfPeople(), [Validators.required, Validators.min(1)]],
      additionalInfo: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.restaurantId = +params['restaurantId'] || 0;
      this.loadRestaurantData();
     
    });   

    // Escuchar cambios en el número de personas y actualizar el signal
    this.reservationForm.get('numberOfPeople')?.valueChanges.subscribe(value => {
      this.numberOfPeople.set(value);
    }); 

    const token = this.route.snapshot.queryParamMap.get('token');
    const payerId = this.route.snapshot.queryParamMap.get('PayerID');

    if (token && payerId) {
          this.loading = true;

          this.checkoutService.capturePaypalOrder(token)
            .subscribe(response => {
              if (response.completed) {               
                //this.router.navigate(['/pages/reservation/confirmation', response.reservationId]);
                this.router.navigate(['/pages/reservation/confirmation']);
              }
    });
  }


  }

  get user() {
    return this.authService.getCurrentUser();
  }


  
  loadRestaurantData(): void {
    this.restaurantService.getRestaurantById(this.restaurantId).subscribe({
      next: (restaurant) => {
        this.restaurant = restaurant;
      
      },
      error: () => this.snackBar.open('Failed to load restaurant data.', 'Close', { duration: 3000 })
    });
  }


  onSubmit(): void {
    if (this.reservationForm.valid) {
      const reservationRequest: ReservationRequest = {
        restaurantId: this.restaurantId,       
        reservationDate: this.combineDateAndTime(this.reservationForm.get('reservationDate')!.value, this.reservationForm.get('reservationTime')!.value),
        numberOfPeople: this.reservationForm.get('numberOfPeople')!.value,
        additionalInfo: this.reservationForm.get('additionalInfo')!.value
      };


      this.reservationService.createReservation(reservationRequest).subscribe({
        next: (response) => {
          this.showSnackBar('Reservation created successfully!');
          // Aquí puedes hacer la redirección o mostrar el botón de PayPal
          this.showPaypalButton = true; // Asegúrate de declarar `showPaypalButton` en tu clase
          this.reservationConfirmed = true;
          this.reservation = response; // Guarda la respuesta para usarla en el pago
        },
        error: () => this.showSnackBar('Failed to load reservation details!')
      });
    }
  }

  onCancel() {
    this.router.navigate(['/pages/restaurants']);
  }

  loadReservationDetails(): void {
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: (reservation) => this.reservation = reservation,
      error: () => this.showSnackBar('Failed to load reservation details!')
    });
  }  

  onPayWithPayPal():void{
    this.loading = true;
     
    this.checkoutService.createPaypalOrder(this.reservation.id)
    .subscribe(response => {
      localStorage.setItem('reservationId',this.reservation.id.toString());  
      window.location.href = response.paypalUrl;    
    })
  }

   //TODO: implementar luego en un util porque se utiliza en varios componentes
   private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  private combineDateAndTime(date: Date, time: string): string {
      const [hours, minutes] = time.split(':');
      const combinedDateTime = new Date(date);

      // Ajustar las horas y minutos locales
      combinedDateTime.setHours(+hours, +minutes, 0, 0);

      // Obtener el desplazamiento de la zona horaria local en minutos
      const timezoneOffset = combinedDateTime.getTimezoneOffset();

      // Ajustar la fecha y hora según el desplazamiento de la zona horaria
      combinedDateTime.setMinutes(combinedDateTime.getMinutes() - timezoneOffset);

      // Convertir la fecha y hora ajustada a ISO string y retornar
      return combinedDateTime.toISOString();
  }



}
