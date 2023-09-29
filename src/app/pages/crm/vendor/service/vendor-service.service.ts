import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {FormControl, FormGroup} from "@angular/forms";
import {environment} from "../../../../../environments/environment";
import {CRM_VENDOR} from "../model/vendor.model";
const ENDPOINT_SAVE_ENTITY: string = environment.API_BASE_URL + '/crm/save_entity';
const ENDPOINT_ENTITY_LIST: string = environment.API_BASE_URL + '/crm/entity_list';
const ENDPOINT_LOV_MAP: string = environment.API_BASE_URL + '/crm/load_lov_map';
const ENDPOINT_GET_ENTITY_BY_ID: string = environment.API_BASE_URL + '/crm/entity_by_id';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class VendorServiceService {

  constructor( private http: HttpClient) { }
  save(purchase: CRM_VENDOR): Observable<any> {
    return this.http.post<CRM_VENDOR>(ENDPOINT_SAVE_ENTITY, JSON.stringify(purchase) , httpOptions);
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


}
