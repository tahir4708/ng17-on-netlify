import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {jqxDropDownListComponent} from "jqwidgets-ng/jqxdropdownlist";
import {jqxDateTimeInputComponent} from "jqwidgets-ng/jqxdatetimeinput";
import {FormBuilder, FormGroup} from "@angular/forms";
import {INV_PRODUCTS} from "../../product/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../product/product.service";
import {BasicLoginService} from "../../../auth/login/basic-login/basic-login.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {PurchaseOrder} from "../model/purchase-order.model";
import {PurchaseOrderService} from "../service/purchase-order.service";
import jqxDataTable = jqwidgets.jqxDataTable;
import {jqxDataTableComponent} from "jqwidgets-ng/jqxdatatable";
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {PurchaseOrderLines} from "../model/purchase-order-lines.model";
import {CommonService} from "../../../../common/common.service";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";
import {debounceTime, distinctUntilChanged, Observable, OperatorFunction} from "rxjs";
import {map} from "rxjs-compat/operator/map";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-purchase-order-form',
  templateUrl: './purchase-order-form.component.html',
  styleUrls: ['./purchase-order-form.component.scss']
})
export class PurchaseOrderFormComponent implements OnInit {

  @ViewChild('dataTable') dataTable: jqxGridComponent ;

  @ViewChild('selectedRowIndex', { static: false }) selectedRowIndex: ElementRef;
  @ViewChild('unselectedRowIndex', { static: false }) unselectedRowIndex: ElementRef;

  @ViewChild('brand') brand!: jqxDropDownListComponent;
  @ViewChild('status') status!: jqxDropDownListComponent;
  @ViewChild('location') location!: jqxDropDownListComponent;
  @ViewChild('productType') productType!: jqxDropDownListComponent;
  @ViewChild('category') category!: jqxDropDownListComponent;

  @ViewChild('created_date') created_date: jqxDateTimeInputComponent;
  @ViewChild('modified_date') modified_date: jqxDateTimeInputComponent;

  @ViewChild('search_text', {static: true}) search_text: jqxInputComponent;

  public componentName: any;
  public routerUrl: string;
  public formGroup: FormGroup;
  public entity: PurchaseOrder;
  public lovMapForBrand: any;
  public lovMapForStatus: any;
  public lovMapForLocation: any;
  public lovMapForProductType: any;
  public lovMapForCategory: any;
  public currentUser: any;
  public selected: any;
  private filtered: any;
  public id: any;
  isAddMode: boolean;
  private selectElement: any;
  private updating: Boolean;
  public dataAdapter: any;
  public columns: any;
  public source: any;
  public  sumOfPurchasePrice: any=0;
  public sumOfQuantity: any=0;
  public lovMap: any;
  public listOfData: any;
  private disableButton: { saveBtn: boolean };
  public searchSource: any;
  private searchResult: any;
  private filterForm: FormGroup;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private service: PurchaseOrderService,
              private loginService: BasicLoginService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService,
              private commonService: CommonService
  ) {
    this.componentName = this.route.snapshot.routeConfig.component.name;
    console.log(this.componentName);
    this.filterForm = this.fb.group({
      product_name: [''],
      product_id: [],
      purchase_id: [],
    });
  }

  public model: any;



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
  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'puchase_detail_id', type: 'int'},
        { name: 'purchase_id', type: 'int'},
        { name: 'product_id', type: 'int' },
        { name: 'purchase_price', type: 'decimal'},
        { name: 'purchase_quantity', type: 'int'},
        { name: 'unit_type_id', type: 'int'},
        { name: 'allowed_discount', type: 'decimal'},
        { name: 'allowed_tax', type: 'decimal'},
        { name: 'sale_price', type: 'decimal'},
        { name: 'profit_percentage', type: 'decimal'},
        { name: 'deleted', type: 'bool'},
      ],
      id: 'puchase_detail_id',
      root: 'purchase',
      localdata: this.entity
    };

    this.columns = [
      { text: 'puchase detail id', dataField: 'puchase_detail_id', hidden:true },
      { text: 'purchase id', dataField: 'purchase_id',hidden:true},
      { text: 'Product', dataField: 'product_id', displayfield: 'product_name', disable:false},
      { text: 'purchase price', dataField: 'purchase_price' },
      { text: 'purchase quantity', dataField: 'purchase_quantity' },
      { text: 'unit type id', dataField: 'unit_type_id',hidden:true },
      { text: 'Unit Type', dataField: 'unit_type_name',hidden:true },
      { text: 'Discount', dataField: 'allowed_discount' },
      { text: 'Tax', dataField: 'allowed_tax' },
      { text: 'Profit %age', dataField: 'profit_percentage' },
      { text: 'Sale Price', dataField: 'sale_price' },
      { text: 'deleted', dataField: 'deleted' ,hidden:true},

    ]
    this.dataAdapter =new jqx.dataAdapter(this.source);


  }

 addRow(){
   this.dataTable.addrow(null,{product_id: 12,purchase_id: 13});
 }
  ngOnInit() {
    this.initTable();

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
      purchase_id: [0],
      purchased_quantity: [0],
      purchased_price: [0],
      date_of_purchase: [''],
      deleted: [0],
      created_by: [0],
      created_date: [''],
      modified_by: [0],
      modified_date: [''],
      status: [''],
      vendor_id: [0],
      purchase_type_id: [0],
      purchase_order_lines: this.fb.array([])
    });

    if (!this.isAddMode) {

      this.SpinnerService.show();
      this.service.getEntityById(this.id)
        .subscribe(x => {
          this.formGroup.patchValue(x.entity);
          this.SpinnerService.hide();
        });
    }



    this.searchSource = (query: any, response: any): any => {
      if (query.trim().length >= 1) {
        const dataAdapter = new jqx.dataAdapter({
          datatype: 'json',
          datafields: [
            {name: 'product_id'},
            {name: 'searchKey'},
            {name: 'product_name'},
            {name: 'purchase_id'}
          ],
          url:  'https://localhost:7130/purchase/search_product?searchText=' + query
        }, {
          beforeSend: (xhr) => {
            //xhr.setRequestHeader('Authorization', authToken);
            //xhr.setRequestHeader('TENANT', sessionStorage.TENANT);
          },
          autoBind: true,
          formatData: (data: any): any => {
            data.name_startsWith = query;
            return data;
          },
          loadComplete: (data: any): any => {
            this.disableButton = {saveBtn: true};
            this.searchResult = data.entity;
            if (data.entity.length === 0) {
              //this.fillGrid([]);
            }
            response(data.entity);
          }
        });
      } else {
        //this.fillGrid([]);
        this.filterForm.patchValue({product_id: null, product_name: null, purchase_id: null});
       // this.ref.detectChanges();
      }
    };
  }

  async saveEntity() {
    if(this.id > 0){
      this.SpinnerService.show();
      this.entity = <PurchaseOrder>this.formGroup.value;
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
      this.entity.detail = this.formGroup.controls.purchase_order_lines.value;
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

  OnRowSelect(event: any): void {
    console.log(JSON.stringify(event.args.value.value));
    if(event.args.datafield === 'purchase_price'){
      this.sumOfPurchasePrice = this.sumOfPurchasePrice + event.args.value;
      console.log(this.sumOfPurchasePrice);
    }else if(event.args.datafield === 'purchase_quantity'){
      this.sumOfQuantity = this.sumOfQuantity + event.args.value;
      console.log(this.sumOfQuantity);
    }
  };
  OnRowUnselect(event: any): void {
    this.unselectedRowIndex.nativeElement.innerHTML = event.args.rowindex;
  };

  onSelectFromDrop(event: any){
    console.log(event.target.value);
  }

  studentSelected(event): void {
    console.log(event);
    if (event.args && event.args.item) {
      const selStd: any = this.searchResult.filter(value => (value.studentId === +event.args.item.value));
      this.filterForm.patchValue({product_id: event.args.item.value,
        product_name: event.args.item.label,
        searchKey: null,
        /*purchase_id: selStd[0].departmentId*/});

      this.dataTable.addrow(null,{product_id: this.filterForm.getRawValue()?.product_id, product_name: this.filterForm.getRawValue()?.product_name });
      this.searchResult = [];
    }
    //this.ref.detectChanges();
    //this.erpTreeInputComponent.selectNode();
  }





}
