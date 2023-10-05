import { Component, OnInit } from '@angular/core';
import {InventoryService} from '../../inventory-service.service';
import {inv_brands} from '../../../model/inv/inv_brands.model';
import {NgxSpinnerService} from "ngx-spinner";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit {
  menuTitle: any;
  brandList: any;
  routerComponent: any;
  editRoute: any;
  brand: inv_brands;
  values: number[] = [102, 115, 130, 137];
   currentUser: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public inventory: InventoryService,
              private SpinnerService: NgxSpinnerService) {

    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
  }
  ngOnInit() {
    this.menuTitle = 'Brand Data';
    this.routerComponent = '/inventory/brands-form';
    this.getBrandsList();
  }

  async getBrandsList() {
    this.SpinnerService.show();
    return this.inventory.brands_list().subscribe((data) => {
      this.brandList = data.entity;
      console.log(this.brandList);
      this.SpinnerService.hide();
    });
  }
  async deleteBrand(brandId) {
    debugger;
    this.inventory.getBrandById(brandId)
      .subscribe(x => {
        this.brand =   x.entity;
        this.SpinnerService.hide();
      });
    this.SpinnerService.show();
    this.brand.deleted = true;
    this.brand.modified_by = this.currentUser.modified_by;
    return this.inventory.save(this.brand).subscribe((data) => {
      this.brandList = data.entity;
      console.log(this.brandList);
      this.SpinnerService.hide();
    });
  }

  editBrand(event){
    console.log(event);
    this.router.navigate(['/inventory/brands-form/'+event])
  }

}
