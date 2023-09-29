import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {jqxWindowComponent} from "jqwidgets-ng/jqxwindow";
import {CRM_VENDOR} from "../../vendor/model/vendor.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../inventory/product/product.service";
import {VendorServiceService} from "../../vendor/service/vendor-service.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DatePipe} from "@angular/common";
import jqxDataTable = jqwidgets.jqxDataTable;
import {ContactService} from "../contact.service";
import {CRM_CONTACT} from "../model/contact.model";

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {

  @ViewChild('actionWindow', { static: false }) actionWindow: jqxWindowComponent;
  @ViewChild('dataTable') dataTable: jqxDataTable;
  menuTitle: any;
  entityList: any;
  routerComponent: any;
  editRoute: any;
  public entity: CRM_CONTACT;
  columns: any;
  currentUser: any;
  dataAdapter: any;
  venfor_id: any;

  source: any;
  private contact_id: string;
  constructor(private route: ActivatedRoute,
              private router: Router,
              public inventory: ProductService,
              public service: ContactService,
              private SpinnerService: NgxSpinnerService,
              private ref: ChangeDetectorRef,
              private datepipe: DatePipe) {

    console.log(this.router.config);
    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
  }


  ngOnInit() {
    this.menuTitle = 'Contacts';
    this.routerComponent = '/crm/contact-form';
    this.initTable();
    this.getEntityList();
  }

  initTable(){

    this.source = {
      dataType: 'json',
      dataFields: [
        { name: 'contact_id', type: 'int'},
        { name: 'first_name', type: 'string'},
        { name: 'last_name', type: 'string'},
        { name: 'contact_title', type: 'string'},
        { name: 'cnic', type: 'string'},
        { name: 'address_line', type: 'string'},
        { name: 'city_id', type: 'int'},
        { name: 'country_id', type: 'int'},
        { name: 'zip_code', type: 'string'},
        { name: 'contact_type_id', type: 'int'},
        { name: 'contact_type_name', type: 'string'},
        { name: 'mobile_no', type: 'string'},
        { name: 'created_date', type: 'DateTime'},
        { name: 'created_by', type: 'int'},
        { name: 'modified_date', type: 'DateTime'},
        { name: 'modified_by', type: 'int'},
        { name: 'session_id', type: 'int'},
        { name: 'status', type: 'string'},
        { name: 'deleted', type: 'bool'},

      ],
      id: 'contact_id',
      root: 'entity',
      localdata: this.entity
    };

    this.columns = [
      { text: 'contact id', dataField: 'contact_id', width: 300 ,hidden: true},
      { text: 'contact id', dataField: 'first_name', width: 300 ,hidden: true},
      { text: 'contact id', dataField: 'last_name', width: 300 ,hidden: true},
      { text: 'Name', dataField: 'contact_title', width: 200 },
      { text: 'CNIC', dataField: 'cnic', width: 200 },
      { text: 'Address', dataField: 'address_line', width: 300 },
      { text: 'city id', dataField: 'city_id', width: 300 ,hidden: true},
      { text: 'country id', dataField: 'country_id', width: 300,hidden: true },
      { text: 'Zip', dataField: 'zip_code', width: 75 },
      { text: 'contact type id', dataField: 'contact_type_id', width: 300,hidden: true },
      { text: 'Type', dataField: 'contact_type_name', width: 200},
      { text: 'Mobile / Phone', dataField: 'mobile_no', width: 200 },
      { text: 'created date', dataField: 'created_date', width: 300 ,hidden: true},
      { text: 'created by', dataField: 'created_by', width: 300,hidden: true },
      { text: 'modified date', dataField: 'modified_date', width: 300 ,hidden: true},
      { text: 'modified by', dataField: 'modified_by', width: 300 ,hidden: true},
      { text: 'session id', dataField: 'session_id', width: 300 ,hidden: true},
      { text: 'status', dataField: 'status', width: 300 ,hidden: true},
      { text: 'deleted', dataField: 'deleted', width: 300 ,hidden: true},

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

  editProduct(event){
    console.log(event);
    this.router.navigate(['/crm/contact-form/'+event])
  }

  tableOnBindingComplete(): void {
    this.dataTable.focus();
    this.dataTable.selectRow(0);
  }

  OnRowDoubleClick(event: any): void {
    let args = event.args;
    let index = args.index;
    let row = args.row;
    this.contact_id =row.contact_id;
    // Update the widgets inside Window.
    this.actionWindow.setTitle('Altert: ' + row.contact_id);
    this.actionWindow.open();
  };
  editButtionClick(): void {
    this.router.navigate(['crm/contact-form/'+this.contact_id])
    this.actionWindow.hide();
  };

  deleteButtomClick(): any {
     debugger;
     this.service.getEntityById(this.contact_id)
       .subscribe(x => {
         this.entity =   x.entity;
         this.SpinnerService.hide();
       });
     this.SpinnerService.show();
     this.entity.deleted = true;
     this.entity.modified_by = this.currentUser.modified_by;
     return this.service.save(this.entity).subscribe((data) => {
       this.service.entityList().subscribe((data) => {
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
