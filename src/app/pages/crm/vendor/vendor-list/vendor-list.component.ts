import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {jqxWindowComponent} from "jqwidgets-ng/jqxwindow";
import {ActivatedRoute, Router} from "@angular/router";
import {NgxSpinnerService} from "ngx-spinner";
import jqxDataTable = jqwidgets.jqxDataTable;
import {DatePipe} from "@angular/common";
import {CRM_VENDOR} from "../model/vendor.model";
import {ProductService} from "../../../inventory/product/product.service";
import {VendorServiceService} from "../service/vendor-service.service";

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  @ViewChild('actionWindow', { static: false }) actionWindow: jqxWindowComponent;
  @ViewChild('dataTable') dataTable: jqxDataTable;
  menuTitle: any;
  entityList: any;
  routerComponent: any;
  editRoute: any;
  public entity: CRM_VENDOR;
  columns: any;
  currentUser: any;
  dataAdapter: any;
  contact_id: any;

  source: any;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public inventory: ProductService,
              public service: VendorServiceService,
              private SpinnerService: NgxSpinnerService,
              private ref: ChangeDetectorRef,
              private datepipe: DatePipe) {

    console.log(this.router.config);
    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
  }


  ngOnInit() {
    this.menuTitle = 'Vendor Data';
    this.routerComponent = '/crm/vendor-form';
    this.initTable();
    this.getEntityList();
  }

  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'vendor_id', type: 'int'},
        { name: 'contact_id', type: 'int'},
        { name: 'contact_name', type: 'string'},
        { name: 'address_line', type: 'string'},
        { name: 'mobile_no', type: 'string'},
        { name: 'shop_name', type: 'string'},
        { name: 'created_by', type: 'int'},
        { name: 'created_date', type: 'DateTime'},
        { name: 'modified_by', type: 'int'},
        { name: 'modified_date', type: 'DateTime'},
        { name: 'deleted', type: 'bool'},
        { name: 'status', type: 'string'},
      ],
      id: 'vendor_id',
      root: 'entity',
      localdata: this.entity
    };

    this.columns = [
      { text: 'vendor id', dataField: 'vendor_id', width: 300,hidden:true },
      { text: 'contact id', dataField: 'contact_id', width: 300 ,hidden:true},
      { text: 'Name', dataField: 'contact_name' },
      { text: 'Mobile', dataField: 'mobile_no' },
      { text: 'Address', dataField: 'address_line' },
      { text: 'Shop', dataField: 'shop_name' },
      { text: 'created by', dataField: 'created_by', width: 300,hidden:true },
      { text: 'created date', dataField: 'created_date', width: 300 ,hidden:true},
      { text: 'modified by', dataField: 'modified_by', width: 300 ,hidden:true},
      { text: 'modified date', dataField: 'modified_date', width: 300 ,hidden:true},
      { text: 'deleted', dataField: 'deleted', width: 300,hidden:true },
      { text: 'status', dataField: 'status', width: 300 ,hidden:true},

    ]
    this.dataAdapter =new jqx.dataAdapter(this.source);
  }

  async getEntityList() {
    this.SpinnerService.show();
    return this.service.entityList().subscribe((data) => {
      this.entityList = data.entity;
      console.log(this.entityList);
      this.fillgrid(this.entityList);
      this.SpinnerService.hide();
    });
  }

  fillgrid(gridData){

    this.ref.detectChanges();
    if(this.dataTable !== undefined){
      debugger;
      (this.dataTable.source() as any)._source.localdata = gridData;
      this.dataTable.updateBoundData();
      this.dataTable.refresh();
      if(this.dataTable.getView().length > 0){
        this.dataTable.clearSelection();
      }
    }
  }
  tableOnBindingComplete(): void {
    this.dataTable.focus();
    this.dataTable.selectRow(0);
  }

  OnRowDoubleClick(event: any): void {
    let args = event.args;
    let index = args.index;
    let row = args.row;
    this.contact_id =row.vendor_id;
    // Update the widgets inside Window.
    this.actionWindow.setTitle('Altert: ' + row.contact_id);
    this.actionWindow.open();
  };
  editButtionClick(): void {
    this.router.navigate(['crm/contact-form/'+this.contact_id])
    this.actionWindow.hide();
  };

  deleteButtomClick(): any {
   /* debugger;
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
    });*/
  };

  myWindowOnClose(): void {

  };

}
