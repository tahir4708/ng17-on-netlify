import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {jqxWindowComponent} from "jqwidgets-ng/jqxwindow";
import {INV_PRODUCTS} from "../../product/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../product/product.service";
import {NgxSpinnerService} from "ngx-spinner";
import jqxDataTable = jqwidgets.jqxDataTable;
import {PurchaseOrder} from "../model/purchase-order.model";
import {PurchaseOrderService} from "../service/purchase-order.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss']
})
export class PurchaseOrderListComponent implements OnInit {

  @ViewChild('actionWindow', { static: false }) actionWindow: jqxWindowComponent;
  @ViewChild('dataTable') dataTable: jqxDataTable;
  menuTitle: any;
  entityList: any;
  routerComponent: any;
  editRoute: any;
  public product: PurchaseOrder;
  columns: any;
  currentUser: any;
  dataAdapter: any;
  product_id: any;

  source: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public inventory: ProductService,
              public service: PurchaseOrderService,
              private SpinnerService: NgxSpinnerService,
              private ref: ChangeDetectorRef,
              private datepipe: DatePipe) {

    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
  }


  ngOnInit() {
    this.menuTitle = 'Purchase Data';
    this.routerComponent = '/inventory/purchase-form';
    this.initTable();
    this.getProductList();
  }

  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'purchase_id', type: 'int'},
        { name: 'purchased_quantity', type: 'int'},
        { name: 'purchased_price', type: 'decimal'},
        { name: 'date_of_purchase', type: 'DateTime'},
        { name: 'deleted', type: 'bool'},
        { name: 'created_by', type: 'int'},
        { name: 'created_date', type: 'DateTime'},
        { name: 'modified_by', type: 'int'},
        { name: 'modified_date', type: 'DateTime'},
        { name: 'status', type: 'string'},
        { name: 'vendor_id', type: 'int'},
        { name: 'purchase_type_id', type: 'int'},

      ],
      id: 'product_id',
      root: 'product',
      localdata: this.product
    };

    this.columns = [
      { text: 'purchase id', dataField: 'purchase_id', width: 300 ,hidden: true},
      { text: 'Total Purchase Quantity', dataField: 'purchased_quantity', width: 300 },
      { text: 'Total Amount of Purchase', dataField: 'purchased_price', width: 300 },
      { text: 'Purchase Date', dataField: 'date_of_purchase', width: 300, cellsformat: 'dd-MMMM-yyyy' },
      { text: 'deleted', dataField: 'deleted', width: 300 ,hidden: true},
      { text: 'created by', dataField: 'created_by', width: 300 ,hidden: true},
      { text: 'created date', dataField: 'created_date', width: 300 ,hidden: true},
      { text: 'modified by', dataField: 'modified_by', width: 300 ,hidden: true},
      { text: 'modified date', dataField: 'modified_date', width: 300 ,hidden: true},
      { text: 'status', dataField: 'status', width: 300 ,hidden: true},
      { text: 'vendor id', dataField: 'vendor_id', width: 300 ,hidden: true},
      { text: 'Vendor', dataField: 'vendor_name', width: 300 },
      { text: 'Type', dataField: 'purchase_type_name', width: 300 },

    ]
    this.dataAdapter =new jqx.dataAdapter(this.source);
  }

  async getProductList() {
    this.SpinnerService.show();
    return this.service.entityList().subscribe((data) => {
      this.entityList = data.entity;
      this.fillgrid(this.entityList);
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
    return this.service.save(this.product).subscribe((data) => {
      this.inventory.product_list().subscribe((data) => {
        this.entityList = data.entity;
        this.fillgrid(this.entityList);
        this.SpinnerService.hide();
        this.actionWindow.hide();
      });
    });
  };

  myWindowOnClose(): void {

  };

}
