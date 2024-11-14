export interface ReservationRequest {
	restaurantId: number;	
	reservationDate: string; 
	numberOfPeople: number;
	additionalInfo?: string; // El signo "?" indica que esta propiedad es opcional, 
                             // es decir, no es obligatorio incluirla al crear un objeto de este tipo.
}

  