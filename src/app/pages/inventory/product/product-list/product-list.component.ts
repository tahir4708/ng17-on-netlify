import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {InventoryService} from "../../inventory-service.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ProductService} from "../product.service";
import {INV_PRODUCTS} from "../product.model";
import {environment} from "../../../../../environments/environment";
import {jqxDateTimeInputComponent} from "jqwidgets-ng/jqxdatetimeinput";
import jqxDataTable = jqwidgets.jqxDataTable;
import {jqxWindowComponent} from "jqwidgets-ng/jqxwindow";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @ViewChild('actionWindow', { static: false }) actionWindow: jqxWindowComponent;
  @ViewChild('dataTable') dataTable: jqxDataTable;
  @ViewChild('searchComponent') searchComponent: jqxInputComponent;
  menuTitle: any;
  productList: any;
  routerComponent: any;
  editRoute: any;
  product: INV_PRODUCTS;
  columns: any;
  currentUser: any;
  dataAdapter: any;
  product_id: any;

  source: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public inventory: ProductService,
              private SpinnerService: NgxSpinnerService,
              private ref: ChangeDetectorRef) {

    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
  }


  ngOnInit() {
    this.menuTitle = 'Product Data';
    this.routerComponent = '/inventory/product-form';
    this.initTable();
    this.getProductList();
  }

  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'product_id', type: 'int'},
        { name: 'product_name', type: 'string'},
        { name: 'product_code', type: 'string'},
        { name: 'product_description', type: 'string'},
        { name: 'product_barcode', type: 'string'},
        { name: 'product_price', type: 'int'},
        { name: 'brand_id', type: 'int'},
        { name: 'brand_name', type: 'string'},
        { name: 'category_id', type: 'int'},
        { name: 'product_alias_name', type: 'string'},
        { name: 'created_date', type: 'DateTime'},
        { name: 'created_by', type: 'int'},
        { name: 'modified_date', type: 'DateTime'},
        { name: 'modified_by', type: 'int'},
        { name: 'session_id', type: 'int'},
        { name: 'status', type: 'string'},
        { name: 'product_type_id', type: 'int'},
        { name: 'deleted', type: 'bool'},
        { name: 'stock_quantity', type: 'int'},
        { name: 'stock_unit', type: 'string'},
        { name: 'grade', type: 'string'},
        { name: 'size', type: 'string'},
        { name: 'location_id', type: 'int'},
        { name: 'location_name', type: 'string'},
        { name: 'used_for', type: 'string'},
      ],
      id: 'product_id',
      root: 'product',
      localdata: this.product
    };

    this.columns = [
      { text: 'product id', dataField: 'product_id', hidden: true , width: 300 },
      { text: 'Name', dataField: 'product_name', width: 200 },
      { text: 'Code', dataField: 'product_code', width: 100 },
      { text: 'Description', dataField: 'product_description', width: 200, hidden: true },
      { text: 'Used For', dataField: 'used_for', width: 200 },
      { text: 'Barcode', dataField: 'product_barcode', width: 100 },
      { text: 'Price', dataField: 'product_price', width: 100 },
      { text: 'brand id', dataField: 'brand_id',hidden: true, width: 300 },
      { text: 'Brand', dataField: 'brand_name',hidden: true, width: 300 },
      { text: 'category id', dataField: 'category_id', hidden:true, width: 300 },
      { text: 'Desi Name', dataField: 'product_alias_name', width: 200 },
      { text: 'created date', dataField: 'created_date', hidden:true,width: 300 },
      { text: 'created by', dataField: 'created_by', hidden:true, width: 300 },
      { text: 'modified date', dataField: 'modified_date', hidden:true, width: 300 },
      { text: 'modified by', dataField: 'modified_by', hidden:true, width: 300 },
      { text: 'session id', dataField: 'session_id', hidden:true, width: 300 },
      { text: 'Status', dataField: 'status', hidden:true, width: 300 },
      { text: 'Product type id', dataField: 'product_type_id', hidden:true, width: 300 },
      { text: 'deleted', dataField: 'deleted', hidden:true, width: 300 },
      { text: 'Available Quantity', dataField: 'stock_quantity', width: 150 },
      { text: 'Unit', dataField: 'stock_unit', width: 100 },
      { text: 'Grade', dataField: 'grade', width: 100 },
      { text: 'Size', dataField: 'size', width: 100 },
      { text: 'location id', dataField: 'location_id',hidden:true, width: 300 },
      { text: 'Location', dataField: 'location_name', width: 100},

    ]
    this.dataAdapter =new jqx.dataAdapter(this.source);
  }

  async getProductList() {
    this.SpinnerService.show();
    return this.inventory.product_list().subscribe((data) => {
      this.productList = data.entity;
      this.fillgrid(this.productList);
      console.log(this.productList);
      this.SpinnerService.hide();
    });
  }

  async getEntityListBySearch(event) {
    console.log(event);
    console.log(this.searchComponent.value());
    return this.inventory.search_product(event.target.value).subscribe((data) => {
      this.productList = data.entity;
      this.fillgrid(this.productList);
      console.log(this.productList);
      this.searchComponent.focus();
      this.SpinnerService.hide();
    });
  }

  fillgrid(gridData){

    this.ref.detectChanges();
    if(this.dataTable !== undefined){
      console.log(gridData);
      (this.dataTable.source() as any)._source.localdata = gridData;
      this.dataTable.updateBoundData();
      this.dataTable.refresh();
      if(this.dataTable.getView().length > 0){
        this.dataTable.clearSelection();
      }
    }
  }

  async deleteProduct(productId) {
    debugger;
    this.inventory.getProductById(productId)
      .subscribe(x => {
        this.product =   x.entity;
        this.SpinnerService.hide();
      });
    this.SpinnerService.show();
    this.product.deleted = true;
    this.product.modified_by = this.currentUser.modified_by;
    return this.inventory.save(this.product).subscribe((data) => {
      this.productList = data.entity;
      console.log(this.productList);
      this.SpinnerService.hide();
    });
  }

  editProduct(event){
    console.log(event);
    this.router.navigate(['/inventory/product-form/'+event])
  }

  tableOnBindingComplete(): void {
    this.dataTable.focus();
    this.dataTable.selectRow(0);
  }

  OnRowDoubleClick(event: any): void {
    let args = event.args;
    let index = args.index;
    let row = args.row;
    this.product_id =row.product_id;
    // Update the widgets inside Window.
    this.actionWindow.setTitle('Altert: ' + row.product_id);
    this.actionWindow.open();
  };
  editButtionClick(): void {
    this.router.navigate(['/inventory/product-form/'+this.product_id])
    this.actionWindow.hide();
  };

  deleteButtomClick(): any {
    debugger;
    this.inventory.getProductById(this.product_id)
      .subscribe(x => {
        this.product =   x.entity;
        this.SpinnerService.hide();
      });
    this.SpinnerService.show();
    this.product.deleted = true;
    this.product.modified_by = this.currentUser.modified_by;
    return this.inventory.save(this.product).subscribe((data) => {
      this.inventory.product_list().subscribe((data) => {
        this.productList = data.entity;
        this.fillgrid(this.productList);
        console.log(this.productList);
        this.SpinnerService.hide();
        this.actionWindow.hide();
      });
    });
  };

  myWindowOnClose(): void {

  };
}
