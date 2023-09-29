import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {jqxDropDownListComponent} from "jqwidgets-ng/jqxdropdownlist";
import {jqxDateTimeInputComponent} from "jqwidgets-ng/jqxdatetimeinput";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
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
import {parse} from "@angular/compiler-cli/linker/babel/src/babel_core";

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
  @ViewChild('vendor') vendor!: jqxDropDownListComponent;
  @ViewChild('billStatus') billStatus!: jqxDropDownListComponent;
  @ViewChild('category') category!: jqxDropDownListComponent;

  @ViewChild('created_date') created_date: jqxDateTimeInputComponent;
  @ViewChild('purchase_date') purchase_date: jqxDateTimeInputComponent;

  @ViewChild('search_text', {static: true}) search_text: jqxInputComponent;

  public componentName: any;
  public routerUrl: string;
  public formGroup: FormGroup;
  public entity: PurchaseOrder;
  public lovMapForBrand: any;
  public lovMapForVendors: any;
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
  public remaingAmountToBePaid: any;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private service: PurchaseOrderService,
              private loginService: BasicLoginService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService,
              private commonService: CommonService,
              private ref: ChangeDetectorRef,
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




  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'puchase_detail_id', type: 'int'},
        { name: 'purchase_id', type: 'int'},
        { name: 'product_id', type: 'int' },
        { name: 'product_name', type: 'int' },
        { name: 'purchase_price', type: 'decimal'},
        { name: 'purchase_quantity', type: 'int'},
        { name: 'unit_type_id', type: 'int'},
        { name: 'unit_type_name', type: 'int'},
        { name: 'allowed_discount', type: 'decimal'},
        { name: 'allowed_tax', type: 'decimal'},
        { name: 'sale_price', type: 'decimal'},
        { name: 'total_price_of_item', type: 'decimal'},
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
      { text: 'product id', dataField: 'product_id',  editable:false,hidden:true },
      { text: 'Product', dataField: 'product_name', editable:false},
      { text: 'purchase price', dataField: 'purchase_price'},
      { text: 'purchase quantity', dataField: 'purchase_quantity'},
      { text: 'unit type id', dataField: 'unit_type_id',hidden:true },
      { text: 'Unit Type', dataField: 'unit_type_name' ,cellbeginedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void =>{
          const  transaction: any = {};
          transaction.purchased_price = +this.dataTable.getcellvalue(row, 'purchase_price');
          transaction.purchase_quantity = +this.dataTable.getcellvalue(row, 'purchase_quantity');
          const purchased_price = transaction.purchased_price;
          this.dataTable.setcellvalue(row,'total_price_of_item',purchased_price*transaction.purchase_quantity);
        }},
      {
        text: 'Discount', dataField: 'allowed_discount'
      },
      { text: 'Tax', dataField: 'allowed_tax' },
      { text: 'Profit %age', dataField: 'profit_percentage' },
      { text: 'deleted', dataField: 'deleted' ,hidden:true,
        cellbeginedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void =>{
          const  transaction: any = {};
          transaction.purchased_price = +this.dataTable.getcellvalue(row, 'purchase_price');
          transaction.profit_percentage = +this.dataTable.getcellvalue(row, 'profit_percentage');
          transaction.allowed_tax = +this.dataTable.getcellvalue(row, 'allowed_tax');

          transaction.purchase_quantity = +this.dataTable.getcellvalue(row, 'purchase_quantity');


          const purchased_price = transaction.purchased_price;
          const calculated_tax_amount = transaction.purchased_price+(purchased_price*transaction.allowed_tax/100);
          const calculated_proft_amount = calculated_tax_amount+(calculated_tax_amount*transaction.profit_percentage/100);

          const  total_price_of_item = purchased_price*transaction.purchased_quantity;
          console.log('============');
          console.log(transaction.purchase_quantity);
          this.dataTable.setcellvalue(row,'sale_price',calculated_proft_amount);

        }},
      { text: 'Sale Price', dataField: 'sale_price',editable: false },
      { text: 'Total', dataField: 'total_price_of_item',editable: false },


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
    this.service.lovMap().subscribe((data) => {


      this.lovMapForBrand = data.lovmap.BillStatus;
      this.lovMapForVendors = data.lovmap.Vendors;
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
      date_of_purchase: [],
      deleted: [false],
      created_by: [0],
      created_date: [],
      modified_by: [],
      modified_date: [],
      status: [''],
      vendor_id: [0],
      purchase_type_id: [0],
      total_bill_amount: [0],
      paid_bill_amount: [0],
      remaining_bill_amount: [0],
      purchase_lines_quantity: [0],
      detail: this.fb.array([])
    });

    if (!this.isAddMode) {

      this.SpinnerService.show();
      this.service.getEntityById(this.id)
        .subscribe(x => {
          this.fillgrid(x.entity[0].detail);
          console.log(x.entity[0]);
          this.formGroup.patchValue(x.entity[0]);
          console.log(this.formGroup.value);
          this.SpinnerService.hide();
        });
    }


    const  token = 'Bearer ' +sessionStorage.getItem('token');
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

          url:  environment.API_BASE_URL+'/purchase/search_product?searchText=' + query
        }, {
          beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', token);
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
  fillgrid(gridData){

    this.ref.detectChanges();
    if(this.dataTable !== undefined){
      console.log(gridData);
      (this.dataTable.source() as any)._source.localdata = gridData;
      this.dataTable.updatebounddata();
      this.dataTable.refresh();
      if(this.dataTable.getrows().length > 0){
        this.dataTable.clearselection();
      }
    }
  }
  async saveEntity() {

    if(this.id > 0){
      this.SpinnerService.show();
      this.entity = <PurchaseOrder>this.formGroup.value;

      this.entity.detail = this.dataTable.getrows();
      this.entity.date_of_purchase = this.purchase_date.getDate();
      console.log(this.entity.date_of_purchase);
      this.entity.modified_by = this.currentUser.user_id;
      this.entity.modified_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      this.service.save(this.entity).subscribe((data) => {

        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/purchase-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }else{
      debugger;
      (this.formGroup.controls.detail as FormArray) = this.fb.array([]);
      if(this.dataTable.getrows().length === 0){
        this.toastr.error('','');
      }else {
        let i=0;
        for(const row of this.dataTable.getrows()){
          this.addLines();
          (this.formGroup.controls.detail as FormArray).controls[i++].patchValue(row);
        }
      }
      console.log('form-------------');
      console.log(this.formGroup.controls.detail.value);
      console.log('end-------------');
      this.SpinnerService.show();
      this.entity = this.formGroup.value;
      this.entity.detail = this.formGroup.controls.detail.value;
      this.entity.deleted = false;
      this.entity.date_of_purchase = this.purchase_date.getDate();
      this.entity.created_by = this.currentUser.user_id;
      this.entity.modified_by = this.currentUser.user_id;
      this.entity.total_bill_amount = this.sumOfPurchasePrice;
      this.entity.remaining_bill_amount = this.remaingAmountToBePaid;

      //this.entity.detail = this.formGroup.controls.purchase_order_lines.getRawValue();
      console.log(this.entity);
      this.service.save(this.entity).subscribe((data) => {
        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/inventory/purchase-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }



  }

  cancel(){
    this.router.navigate(['/inventory/product-list'])
  }

  OnRowSelect(event: any): void {
    debugger;
    if(event.args.datafield === 'total_price_of_item'){

      this.sumOfPurchasePrice = this.sumOfPurchasePrice + event.args.value;
      this.formGroup.controls.total_bill_amount.setValue(this.sumOfPurchasePrice);
      this.remaingAmountToBePaid = this.sumOfPurchasePrice - this.formGroup.controls.paid_bill_amount.value;
      this.formGroup.controls. remaining_bill_amount.setValue(this.remaingAmountToBePaid);


    }
  };
  onRowDobleClick(event: any): void {
    let args = event.args;
    let index = args.index;
    let row = args.row;
    //this.purchase_id =row.purchase_id;
    // Update the widgets inside Window.

    this.dataTable.deleterow(args.row.bounddata.boundindex)
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
      console.log(event.args.item.value);
      this.service.getProductDataById(this.filterForm.getRawValue()?.product_id).subscribe((data)=>{
        var product_data = data.entity;
        console.log(product_data);
        this.dataTable.addrow(null,{product_id: this.filterForm.getRawValue()?.product_id, product_name: this.filterForm.getRawValue()?.product_name, purchase_price: product_data.purchased_price, purchase_quantity: product_data.purchased_quantity, allowed_discount: product_data.allowed_discount,allowed_tax: product_data.allowed_tax });
      })

      this.searchResult = [];
    }
    //this.ref.detectChanges();
    //this.erpTreeInputComponent.selectNode();
  }

  calculatePurchaseLineDiscount(row: number, datafield: number, transaction: any):void{
    // const quantity = +transaction.
  }


  calculateRemaingAmount(event) {
    this.remaingAmountToBePaid=0;
    console.log('---------------');
    console.log(event);
    this.remaingAmountToBePaid =  this.sumOfPurchasePrice -   this.formGroup.controls.paid_bill_amount.value;
    this.formGroup.controls.remaining_bill_amount.setValue(this.remaingAmountToBePaid);
  }
  addLines(): void{
    (this.formGroup.controls.detail as FormArray).push(
      this.fb.group({
        allowed_discount:[0],
        allowed_tax:[0],
        deleted:[false],
        product_id:[0],
        product_name: [''],
        profit_percentage:[0],
        puchase_detail_id:[0],
        purchase_id:[0],
        purchase_price:[0],
        purchase_quantity:[0],
        sale_price:[0],
        unit_type_id:[0],
        total_price_of_item: [0]
      })
    )
  }
}
