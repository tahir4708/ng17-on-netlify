import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from "@angular/forms";
import {PurchaseOrder} from "../model/purchase-order.model";
import {environment} from "../../../../../environments/environment";
const ENDPOINT_SAVE_ENTITY: string = environment.API_BASE_URL + '/save_entity';
const ENDPOINT_ENTITY_LIST: string = environment.API_BASE_URL + '/entity_list';
const ENDPOINT_LOV_MAP: string = environment.API_BASE_URL + '/load_lov_map';
const ENDPOINT_GET_ENTITY_BY_ID: string = environment.API_BASE_URL + '/entity_by_id';
const ENDPOINT_DELETE_ENTITY_BY_ID: string = environment.API_BASE_URL + '/delete_product_by_id';
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
