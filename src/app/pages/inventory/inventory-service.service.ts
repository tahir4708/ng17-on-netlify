import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {inv_brands} from '../model/inv/inv_brands.model';

const ENDPOINT_SAVE_BRAND: string = environment.API_BASE_URL + '/save_brand';
const ENDPOINT_BRANDS_LIST: string = environment.API_BASE_URL + '/brands_list';
const ENDPOINT_LOV_MAP: string = environment.API_BASE_URL + '/loadLovMap';
const ENDPOINT_GET_BRAND_BY_ID: string = environment.API_BASE_URL + '/brand_by_id';
const deleteBrandById: string = environment.API_BASE_URL + '/deleteBrandById';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor( private http: HttpClient) { }
  save(brand: inv_brands): Observable<any> {
    return this.http.post<inv_brands>(ENDPOINT_SAVE_BRAND, JSON.stringify(brand) , httpOptions);
  }
  brands_list(): Observable<any> {
    return this.http.get(ENDPOINT_BRANDS_LIST, httpOptions);
  }

  lovMap(): Observable<any> {
    return  this.http.get(ENDPOINT_LOV_MAP, httpOptions);
  }
  getBrandById(id: any): Observable<any> {
    return  this.http.get(ENDPOINT_GET_BRAND_BY_ID+'?id='+id, httpOptions);
  }
  deleteBrandById(id: any): Observable<any> {
    return  this.http.get(deleteBrandById+'?id='+id, httpOptions);
  }
}
