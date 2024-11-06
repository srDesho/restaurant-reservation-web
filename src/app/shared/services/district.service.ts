import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DistrictResponse } from '../models/response/district-response.model';


@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private baseUrl:string = `${environment.HOST}/districts`;
  private http = inject(HttpClient); 
  
  getAllDistricts(): Observable<DistrictResponse[]> {
    return this.http.get<DistrictResponse[]>(this.baseUrl);
  }
}
