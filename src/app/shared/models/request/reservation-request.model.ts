export interface ReservationRequest {
	restaurantId: number;	
	reservationDate: string; 
	numberOfPeople: number;
	additionalInfo?: string;
  }
  