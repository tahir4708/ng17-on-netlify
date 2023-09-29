import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from "@angular/forms";
import {PurchaseOrder} from "../model/purchase-order.model";
import {environment} from "../../../../../environments/environment";
const ENDPOINT_SAVE_ENTITY: string = environment.API_BASE_URL + '/purchase/save_entity';
const ENDPOINT_ENTITY_LIST: string = environment.API_BASE_URL + '/purchase/entity_list';
const ENDPOINT_LOV_MAP: string = environment.API_BASE_URL + '/purchase/lov_map';
const ENDPOINT_GET_ENTITY_BY_ID: string = environment.API_BASE_URL + '/purchase/entity_by_id';
const ENDPOINT_DELETE_ENTITY_BY_ID: string = environment.API_BASE_URL + '/purchase/delete_product_by_id';
const ENDPOINT_SEARCH_PRODUCT: string = environment.API_BASE_URL + '/purchase/search_product';
const ENDPOINT_PRODUCT_INFO: string = environment.API_BASE_URL + '/purchase/entity_by_product_id';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor( private http: HttpClient) { }
  save(purchase: PurchaseOrder): Observable<any> {
    return this.http.post<PurchaseOrder>(ENDPOINT_SAVE_ENTITY, JSON.stringify(purchase) , httpOptions);
  }
  entityList(): Observable<any> {
    return this.http.get(ENDPOINT_ENTITY_LIST, httpOptions);
  }

  lovMap(): Observable<any> {
    return  this.http.get(ENDPOINT_LOV_MAP, httpOptions);
  }
  getEntityById(id: any): Observable<any> {
    return  this.http.get(ENDPOINT_GET_ENTITY_BY_ID+'?id='+id, httpOptions);
  }
  deleteProductById(id: any): Observable<any> {
    return  this.http.get(ENDPOINT_DELETE_ENTITY_BY_ID+'?id='+id, httpOptions);
  }
  searchProduct(searchText: any): Observable<any> {
    return  this.http.get(ENDPOINT_SEARCH_PRODUCT+'?searchText='+searchText, httpOptions);
  }
  getProductDataById(product_id: any): Observable<any> {
    return  this.http.get(ENDPOINT_PRODUCT_INFO+'?product_id='+product_id, httpOptions);
  }

  validateAllFormFields(formGroup: FormGroup): void{
    Object.keys(formGroup.controls).forEach(field=>{
      const  control = formGroup.get(field);
      if(control instanceof FormControl){
        // control.markAsTouched({onlyself: true});

      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }
    })
  }
}
