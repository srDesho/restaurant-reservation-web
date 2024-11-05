export interface ReservationResponse {
	id: number;
	restaurantName: string;
	reservationDate: string;
	numberOfPeople: number;
	status: string;
	additionalInfo?: string;
	totalAmount: number;  
  }
  