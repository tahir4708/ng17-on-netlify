import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {catchError} from 'rxjs/operators';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {Login_request} from '../../../model/CORE/login_request.model';
import {Menu} from '../../../../shared/menu-items/menu-items';

const ENDPOINT_LOGIN: string = environment.API_BASE_URL + '/sign_in';
const ENDPOINT_GET_MENU: string = environment.API_BASE_URL + '/get_menu_v2';
const ENDPOINT_DEFAULT_VALUES: string = environment.API_BASE_URL + '/loadLovMap';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BasicLoginService {

  constructor( private http: HttpClient) { }
  save(loginRequest: Login_request): Observable<any> {
    return this.http.post<Login_request>(ENDPOINT_LOGIN, loginRequest, httpOptions);
  }
  get_menu(): Observable<any> {
    return this.http.get(ENDPOINT_GET_MENU, httpOptions);
  }
  GetDefaultValues(component: string): Observable<any> {
    return this.http.get(ENDPOINT_DEFAULT_VALUES + '?component=' + component, httpOptions);
  }
}
