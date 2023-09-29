import { Injectable } from '@angular/core';
import {TreeNode} from "primeng/api";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MenuServiceService {

  constructor(private http: HttpClient) { }

  getFilesystem() {
    return this.http.get<any>('assets/filesystem.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }

  getLazyFilesystem() {
    return this.http.get<any>('assets/filesystem-lazy.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
  }
}
