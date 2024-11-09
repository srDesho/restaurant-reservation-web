import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RestaurantResponse } from '../models/response/restaurant-response.model';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from '../models/response/paginated-response.model';

/**
 * Servicio encargado de manejar las operaciones relacionadas con los restaurantes.
 * Proporciona métodos para obtener, buscar y filtrar restaurantes, así como obtener detalles de un restaurante específico.
 */
@Injectable({
  providedIn: 'root' // Hace que el servicio esté disponible de forma global en la aplicación.
})
export class RestaurantService {

  // URL base para los endpoints relacionados con los restaurantes, definida en la configuración del entorno.
  private baseURL: string = `${environment.HOST}/restaurants`; 
  private http = inject(HttpClient); // Inyección del HttpClient de Angular para realizar solicitudes HTTP.

  /**
   * Obtiene todos los restaurantes paginados.
   * @param page El número de página a consultar.
   * @param size La cantidad de restaurantes por página.
   * @returns Un observable con la respuesta paginada de los restaurantes.
   */
  getAllRestaurants(page: number, size: number): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString()); 
    return this.http.get<PaginatedResponse>(`${this.baseURL}/page`, { params });
  }

  /**
   * Busca restaurantes por nombre y dirección, paginados.
   * @param name El nombre del restaurante a buscar.
   * @param address La dirección del restaurante a buscar.
   * @param page El número de página a consultar.
   * @param size La cantidad de restaurantes por página.
   * @returns Un observable con la respuesta paginada de los restaurantes encontrados.
   */
  searchRestaurants(name: string, address: string, page: number, size: number): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('name', name)
      .set('address', address)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PaginatedResponse>(`${this.baseURL}/page/search`, { params });
  }

  /**
   * Filtra restaurantes por nombre de distrito, paginados.
   * @param districtName El nombre del distrito donde buscar los restaurantes.
   * @param page El número de página a consultar.
   * @param size La cantidad de restaurantes por página.
   * @returns Un observable con la respuesta paginada de los restaurantes en el distrito indicado.
   */
  findByDistrictName(districtName: string, page: number, size: number): Observable<PaginatedResponse> {
    const params = new HttpParams()
      .set('districtName', districtName)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse>(`${this.baseURL}/page/district`, { params });
  }

  /**
   * Obtiene los detalles de un restaurante específico por su ID.
   * @param id El ID del restaurante a obtener.
   * @returns Un observable con la respuesta que contiene los detalles del restaurante.
   */
  getRestaurantById(id: number): Observable<RestaurantResponse> {
    return this.http.get<RestaurantResponse>(`${this.baseURL}/${id}`);
  }
}