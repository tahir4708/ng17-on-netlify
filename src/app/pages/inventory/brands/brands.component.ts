import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {inv_brands} from '../../model/inv/inv_brands.model';
import {InventoryService} from '../inventory-service.service';

import {lovmap} from '../../model/CORE/lovmap';
import {Login_request} from '../../model/CORE/login_request.model';
import {BasicLoginService} from '../../auth/login/basic-login/basic-login.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {first} from "rxjs";


@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  @ViewChild('brand_type') brandType!: ElementRef;
  @ViewChild('status') status!: ElementRef;

  public componentName: any;
  public routerUrl: string;
  public brandForm: FormGroup;
  public brand: inv_brands;
  public lovMapForBrandType: any;
  public lovMapForStatus: any;
  public currentUser: any;
  private selected: any;
  private filtered: any;
  public id: any;
  isAddMode: boolean;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private service: InventoryService,
              private loginService: BasicLoginService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService,
              ) {
    this.componentName = this.route.snapshot.routeConfig.component.name;
    console.log(this.componentName);
  }

  /*
   brand_id: number;
  brand_name: string;
  brand_type: number | null;
  created_date: string | null;
  created_by: number | null;
  modified_date: string | null;
  modified_by: number | null;
  session_id: number | null;
  status: string;
  */
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);
    this.isAddMode = !this.id;
    console.log(this.isAddMode);
    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
    this.loginService.GetDefaultValues('brand').subscribe((data) => {

      this.lovMapForBrandType = data.lovmap.BrandType;
      this.lovMapForStatus = data.lovmap.RecordStatus;
    });
    /**/
    this.brandForm = this.fb.group({
      brand_id : new FormControl(),
      brand_name : new FormControl(),
      brand_type: new FormControl(),
      brand_type_name: new FormControl(),
      created_date: new FormControl(),
      created_by: new FormControl(),
      modified_date: new FormControl(),
      modified_by: new FormControl(),
      session_id: new FormControl(),
      session_name: new FormControl(),
      status: new FormControl()
    });

    if (!this.isAddMode) {

      this.SpinnerService.show();
      this.service.getBrandById(this.id)
        .subscribe(x => {
            this.brandForm.patchValue(x.entity);
            this.SpinnerService.hide();
        });
    }
  }

  async saveBrand() {
    if(this.id > 0){
      this.SpinnerService.show();
      this.brand = <inv_brands>this.brandForm.value;
      this.brand.modified_by = this.currentUser.user_id;
      console.log(this.brand);
      this.service.save(this.brand).subscribe((data) => {

        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/brands-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }else{
      this.SpinnerService.show();
      this.brand = <inv_brands>this.brandForm.value;
      this.brand.brand_id = 0;
      this.brand.created_by = this.currentUser.user_id;
      this.brand.modified_by = this.currentUser.user_id;
      console.log(this.brand);
      this.service.save(this.brand).subscribe((data) => {
        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/brands-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }



  }
}


