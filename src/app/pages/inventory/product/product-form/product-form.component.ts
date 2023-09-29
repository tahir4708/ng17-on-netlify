import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {inv_brands} from "../../../model/inv/inv_brands.model";
import {ActivatedRoute, Router} from "@angular/router";
import {InventoryService} from "../../inventory-service.service";
import {BasicLoginService} from "../../../auth/login/basic-login/basic-login.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {INV_PRODUCTS} from "../product.model";
import {ProductService} from "../product.service";
import jqxDropDownList = jqwidgets.jqxDropDownList;
import {jqxDropDownListComponent} from "jqwidgets-ng/jqxdropdownlist";
import {jqxDateTimeInputComponent} from "jqwidgets-ng/jqxdatetimeinput";
import {CommonService} from "../../../../common/common.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  @ViewChild('brand') brand!: jqxDropDownListComponent;
  @ViewChild('status') status!: jqxDropDownListComponent;
  @ViewChild('location') location!: jqxDropDownListComponent;
  @ViewChild('productType') productType!: jqxDropDownListComponent;
  @ViewChild('category') category!: jqxDropDownListComponent;

  @ViewChild('created_date') created_date: jqxDateTimeInputComponent;
  @ViewChild('modified_date') modified_date: jqxDateTimeInputComponent;

  public componentName: any;
  public routerUrl: string;
  public formGroup: FormGroup;
  public entity: INV_PRODUCTS;
  public lovMapForBrand: any;
  public lovMapForStatus: any;
  public lovMapForLocation: any;
  public lovMapForProductType: any;
  public lovMapForCategory: any;
  public currentUser: any;
  private selected: any;
  private filtered: any;
  public id: any;
  isAddMode: boolean;
  private selectElement: any;
  private updating: Boolean;



  constructor(public common: CommonService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private service: ProductService,
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
    this.loginService.GetDefaultValues('product').subscribe((data) => {


      this.lovMapForBrand = data.lovmap.Brand;
      this.lovMapForStatus = data.lovmap.RecordStatus;
      this.lovMapForCategory = data.lovmap.Category;
      this.lovMapForLocation = data.lovmap.Location;
      this.lovMapForProductType = data.lovmap.ProductType;
    });
    /**/
    this.formGroup = this.fb.group({
      brand_id: [0],
      category_id: [0],
      created_by: [''],
      created_date: [''],
      deleted: [''],
      grade: [''],
      location_id: [0],
      modified_by: [''],
      modified_date: [''],
      product_alias_name: [''],
      product_barcode: [''],
      product_code: [''],
      product_description: [''],
      product_id: [0],
      product_name: [''],
      product_price: [''],
      product_type_id: [0],
      session_id: [0],
      size: [''],
      status: [''],
      stock_quantity: [''],
      stock_unit: [''],
      used_for: [''],
    });

    if (!this.isAddMode) {

      this.SpinnerService.show();
      this.service.getProductById(this.id)
        .subscribe(x => {
          this.formGroup.patchValue(x.entity);
          this.SpinnerService.hide();
        });
    }
  }

  async saveBrand() {
    if(this.id > 0){
      this.SpinnerService.show();
      this.entity = <INV_PRODUCTS>this.formGroup.value;
      this.entity.modified_by = this.currentUser.user_id;
      this.entity.modified_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      console.log(this.entity);
      this.service.save(this.entity).subscribe((data) => {

        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/product-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }else{
      this.SpinnerService.show();
      console.log(this.formGroup.value);
      this.entity = this.formGroup.value;
      this.entity.deleted = false;
      this.entity.created_by = this.currentUser.user_id;
      this.entity.created_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      this.entity.modified_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      this.entity.modified_by = this.currentUser.user_id;
      console.log(this.entity);
      this.service.save(this.entity).subscribe((data) => {
        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/product-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }



  }

  listOnSelect(event: any): void {
    if(this.status){
      if(this.entity.status != null && this.entity.status != undefined ){
        const item = this.status.getItemByValue(this.entity.status);
        this.status.selectItem(item);
      }else{
        this.status.clearSelection();
      }
    }

  };

}
