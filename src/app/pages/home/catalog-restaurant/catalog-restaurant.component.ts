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
  
  private restaurantService = inject(RestaurantService);
  private districtService = inject(DistrictService);
  private router = inject(Router);

  restaurants: RestaurantResponse[] = [];
  totalElements: number = 0;
  pageSize: number = 9;
  currentPage: number = 0;  
  districts: DistrictResponse[] = [];
  selectedDistrict: string = 'Todos';

 
  ngOnInit(): void {
    this.getDistricts();
    this.getRestaurants();
  }

  getDistricts() {
    this.districtService.getAllDistricts().subscribe(data => {
      this.districts = data;
    });
  }

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

  filterByDistrict(district: string) {
    this.selectedDistrict = district;
    this.currentPage = 0; 
    this.getRestaurants();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getRestaurants();
  }

  navigateToReservationForm(restaurantId: number) {
    this.router.navigate(['/pages/reservation/form'], { queryParams: { restaurantId: restaurantId } });
  }
 
  getRandomImage(): string {
    return `https://picsum.photos/300/150?random=${Math.floor(Math.random() * 1000)}`;
  }
}
