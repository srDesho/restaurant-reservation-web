import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RestaurantResponse } from '../../../shared/models/response/restaurant-response.model';
import { RestaurantService } from '../../../shared/services/restaurant.service';
import { DistrictService } from '../../../shared/services/district.service';
import { Router } from '@angular/router';
import { DistrictResponse } from '../../../shared/models/response/district-response.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './catalog-restaurant.component.html',
  styleUrls: ['./catalog-restaurant.component.css']
})
export class CatalogRestaurantComponent {
  // Inyección de dependencias para servicios relacionados con restaurantes, distritos y navegación de rutas.
  private restaurantService = inject(RestaurantService);
  private districtService = inject(DistrictService);
  private router = inject(Router);

  // Propiedades para almacenar datos de restaurantes y distritos, así como información de paginación y filtros.
  restaurants: RestaurantResponse[] = [];
  totalElements: number = 0;
  pageSize: number = 9;
  currentPage: number = 0;  
  districts: DistrictResponse[] = [];
  selectedDistrict: string = 'Todos';

  /**
   * Este método de ciclo de vida de Angular se ejecuta al inicializar el componente.
   * Carga la lista de distritos y los restaurantes iniciales.
   */
  ngOnInit(): void {
    this.getDistricts();
    this.getRestaurants();
  }

  /**
   * Llama al servicio para obtener todos los distritos disponibles.
   * Almacena los resultados en la propiedad `districts`.
   */
  getDistricts() {
    this.districtService.getAllDistricts().subscribe(data => {
      this.districts = data;
    });
  }

  /**
   * Obtiene la lista de restaurantes desde el servicio.
   * Si el filtro "Todos" está seleccionado, obtiene todos los restaurantes.
   * Si un distrito específico está seleccionado, filtra los restaurantes por dicho distrito.
   * Actualiza la lista de restaurantes y el total de elementos.
   */
  getRestaurants() {
    if (this.selectedDistrict === 'Todos') {
      this.restaurantService.getAllRestaurants(this.currentPage, this.pageSize).subscribe(response => {
        this.restaurants = response.content;
        this.totalElements = response.totalElements;
      });
    } else {
      this.restaurantService.findByDistrictName(this.selectedDistrict, this.currentPage, this.pageSize).subscribe(response => {
        this.restaurants = response.content;
        this.totalElements = response.totalElements;
      });
    }
  }

  /**
   * Filtra los restaurantes según el distrito seleccionado.
   * Reinicia la página actual a 0 y llama al método `getRestaurants` para aplicar el filtro.
   * @param district - Nombre del distrito seleccionado.
   */
  filterByDistrict(district: string) {
    this.selectedDistrict = district;
    this.currentPage = 0; 
    this.getRestaurants();
  }

  /**
   * Maneja el cambio de página en el paginador.
   * Actualiza los valores de `currentPage` y `pageSize`, y obtiene los restaurantes correspondientes.
   * @param event - Evento de paginación que contiene la nueva página y tamaño.
   */
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRestaurants();
  }

  /**
   * Navega al formulario de reserva con el ID del restaurante como parámetro.
   * @param restaurantId - ID del restaurante para el cual se hará la reserva.
   */
  navigateToReservationForm(restaurantId: number) {
    this.router.navigate(['/pages/reservation/form'], { queryParams: { restaurantId: restaurantId } });
  }

  /**
   * Genera una URL de imagen aleatoria desde Picsum para mostrar imágenes aleatorias en la lista de restaurantes.
   * @returns Una URL de imagen aleatoria.
   */
  getRandomImage(): string {
    return `https://picsum.photos/300/150?random=${Math.floor(Math.random() * 1000)}`;
  }
}