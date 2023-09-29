import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environment";
import {INV_PRODUCTS} from "./product.model";
import {FormControl, FormGroup} from "@angular/forms";
const ENDPOINT_SAVE_PRODUCT: string = environment.API_BASE_URL + '/save_product';
const ENDPOINT_PRODUCT_LIST: string = environment.API_BASE_URL + '/product_list';
const ENDPOINT_LOV_MAP: string = environment.API_BASE_URL + '/loadLovMap';
const ENDPOINT_GET_PRODUCT_BY_ID: string = environment.API_BASE_URL + '/Product_by_id';
const deleteProductById: string = environment.API_BASE_URL + '/deleteProductById';
const ENDPOINT_SEARCH_PRODUCT: string = environment.API_BASE_URL + '/search_product_by_value';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor( private http: HttpClient) { }
  save(product: INV_PRODUCTS): Observable<any> {
    return this.http.post<INV_PRODUCTS>(ENDPOINT_SAVE_PRODUCT, JSON.stringify(product) , httpOptions);
  }
  product_list(): Observable<any> {
    return this.http.get(ENDPOINT_PRODUCT_LIST, httpOptions);
  }
  search_product(searchValue: any): Observable<any> {
    debugger;
    console.log(searchValue);
    if(searchValue != ''){
      return this.http.get(ENDPOINT_SEARCH_PRODUCT+'?searchValue='+searchValue, httpOptions);
    }else{
      return this.http.get(ENDPOINT_PRODUCT_LIST, httpOptions);
    }

  }

  lovMap(): Observable<any> {
    return  this.http.get(ENDPOINT_LOV_MAP, httpOptions);
  }
  getProductById(id: any): Observable<any> {
    return  this.http.get(ENDPOINT_GET_PRODUCT_BY_ID+'?id='+id, httpOptions);
  }
  deleteProductById(id: any): Observable<any> {
    return  this.http.get(deleteProductById+'?id='+id, httpOptions);
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
