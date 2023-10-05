import {ChangeDetectorRef, Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {KcpBillFormModel} from "../model/kcp-bill-form.model";
import {KcpBillLabourRateLinesModel} from "../model/kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "../model/kcp-bill-parts-lines.model";

import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {forEach} from "@angular-devkit/schematics";
import {DatePipe} from "@angular/common";

import { MessageService } from 'primeng/api';
import {NgxSpinnerService} from "ngx-spinner";


@Component({
  providers: [DatePipe,MessageService],
  selector: 'app-kcp-bill-form',
  templateUrl: './kcp-bill-form.component.html',
  styleUrls: ['./kcp-bill-form.component.scss']
})
export class KcpBillFormComponent implements OnInit {
  public dataAdapter: any;
  public columns: any;
  public formGroup: FormGroup;
  pdfDataReceived: boolean = false;
  public labourRateColumns: any;
  public source: any;
  sanitizedPdfDataUrl: SafeResourceUrl = '';
  kcpBill: KcpBillFormModel = {
    vehicleNo: undefined,
    totalLabourBill: undefined, totalPartsBill: undefined,
    id: 0, // Initialize with a default value or the appropriate initial value
    billNo: '',
    workOrderNo: '',
    date: new Date().toISOString().substring(0, 10),
    saleKcpBillPartsLines: [],
    saleKcpBillLabourLines: [],
    totalBill: 0
    // Other properties...
  };
  rates: any;
  labourRateLines: KcpBillLabourRateLinesModel[] = [];
  partsLine: KcpBillPartsLinesModel;

  @ViewChild('dataTable') dataTable: jqxGridComponent ;
  @ViewChild('labourRateDataTable') labourRateDataTable: jqxGridComponent ;
  @ViewChild('labourRateInputComponent') labourRateInputComponent: jqxInputComponent;
  public base64: any;
  pdfData: any;
  private sanitizedPdfData: SafeResourceUrl;
  private id: any;
  private isAddMode: boolean=false;
  private gridData: Array<any>;
  spinner: boolean = false;
  lovMapLabourRates: any;

  constructor(public service: InventoryService,
              public fb: FormBuilder,
              private router: Router,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private ref: ChangeDetectorRef,
              private datePipe: DatePipe,
              private messageService: MessageService,
              private spinnerService: NgxSpinnerService) {


  }
  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    this.isAddMode = !this.id;
    this.service.getKcpLabourRates().subscribe(x => {
      this.spinnerService.show();
      this.lovMapLabourRates = x.entity;
      this.spinnerService.hide();
    });

    if(this.id > 0 && this.id != undefined){
      this.spinnerService.show();
      this.service.getKcpAllBillById(this.id).subscribe(x=>{

        this.kcpBill = x.entity;
        this.fillgrid(x.entity.saleKcpBillPartsLines);
        this.fillgridLabour((x.entity.saleKcpBillLabourLines))
        this.formGroup.patchValue(x.entity);
        this.spinnerService.hide();
      })
    }


    this.initTable();

    this.formGroup = this.fb.group({
      id: [0],
      billNo: [''],
      workOrderNo: [''],
      date: [],
      totalBill: [0],
      totalPartsBill: [0],
      totalLabourBill: [0],
      saleKcpBillLabourLines: this.fb.array([]),
      saleKcpBillPartsLines: this.fb.array([]),
    });
    const formattedDate = this.datePipe.transform(this.kcpBill.date, 'yyyy-MM-dd');
    this.formGroup.patchValue({ date: formattedDate });

  }

  initTable(){
    this.columns = [
      { text: 'work_id', dataField: 'workId', hidden:true },
      // { text: 'product id', dataField: 'product_id',  editable:false,hidden:true },
      { text: 'Product', dataField: 'productName', editable:true},
      { text: 'Product Price', dataField: 'perItemPrice', editable: true },
      {
        text: 'Quantity', dataField: 'quantity', editable: true,

      },
      { text: 'Tax %', dataField: 'taxPercentage',
        cellbeginedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {


          const  transaction: any = {};
          transaction.product_price = this.dataTable.getcellvalue(row, 'perItemPrice');
          transaction.quantity = this.dataTable.getcellvalue(row, 'quantity');
          const total_price = transaction.product_price * transaction.quantity;
          this.dataTable.setcellvalue(row,'totalPrice',total_price);
        },
        cellendedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void=>{

          const  transaction: any = {};
          transaction.product_price = this.dataTable.getcellvalue(row, 'perItemPrice');
          transaction.quantity = this.dataTable.getcellvalue(row, 'quantity');
          transaction.tax =newvalue;
          const percentage = transaction.tax;
          const priceAfterTax =  parseFloat((percentage*transaction.product_price).toFixed(2));
          const quantity = transaction.quantity;
          var total_price = priceAfterTax * quantity;
          this.dataTable.setcellvalue(row,'totalPrice',total_price);
        }},
      { text: 'Total', dataField: 'totalPrice' ,editable: false },
      { text: 'deleted', dataField: 'deleted' ,hidden: 'true' },
    ];

    this.labourRateColumns = [
      { text: 'work rate id', dataField: 'id',hidden:'true', width: 300 },
      { text: 'work item id', dataField: 'workItemId', width: 300 ,hidden:'true'},
      {
        text: 'Rate Description',
        datafield: 'description',
        displayfield: 'label',
        columntype: 'dropdownlist',
        createeditor: function (row, value, editor) {
          if (!editor) {
            // Check if editor is undefined or falsy
            return;
          }

          const dropDownListOptions = {
            filterable: true,
            searchMode: 'containsignorecase',
            source: this.lovMapLabourRates, // Use your source directly
            displayMember: 'label',
            valueMember: 'label'
          };

          const selectEventHandler = function (event) {
            const selectedItem = event.args.item;

            this.labourRateDataTable.setcellvalue(row, 'description', selectedItem.label);
            this.labourRateDataTable.setcellvalue(row, 'workItemId', selectedItem.originalItem.value);
            this.labourRateDataTable.setcellvalue(row, 'labourRate', selectedItem.originalItem.rate);
          }.bind(this);

          // Remove the 'select' event handler if it's already added
          if (editor.off) {
            editor.off('select', selectEventHandler);
          }

          // Add the 'select' event handler
          if (editor.on) {
            editor.on('select', selectEventHandler);

            // Create the jqxDropDownList with options
            editor.jqxDropDownList(dropDownListOptions);
          }
        }.bind(this),


        cellendedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {
          // Your cellendedit logic here
        }
      },



      { text: 'Rate', dataField: 'labourRate' },
      { text: 'deleted', dataField: 'deleted', hidden: 'true' },
    ];
  }

  addRowPartLine() {
    const row: KcpBillPartsLinesModel = {
      deleted: 0,
      id: undefined,
      perItemPrice: undefined,
      productName: undefined,
      quantity: undefined,
      taxPercentage: undefined,
      totalPrice: undefined
    };
    var rows = this.dataTable.getrows();
    this.dataTable.addrow(rows.length+1,row);
  }

  addRowLabourRateLine() {

    const newRow: KcpBillLabourRateLinesModel = {
      deleted: 0,
      id: 0,
      workItemId: 0,
      description: [''],
      labourRate: 0
    };

    var rows = this.dataTable.getrows();
    this.labourRateDataTable.addrow(rows.length+1,newRow);
  }

  OnRowSelect($event: any) {

  }

  onRowDobleClick($event: any) {

  }

  calculateCurrentRateSum() {

    let sum = 0;
    const rowsCount = this.labourRateDataTable.getrows().length;
    for (let i = 0; i < rowsCount; i++) {
      const rowData = this.labourRateDataTable.getrowdata(i);
      const currentRate = rowData.labourRate;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
    }
    this.kcpBill.totalLabourBill = sum;

    this.kcpBill.totalBill = this.kcpBill.totalPartsBill + this.kcpBill.totalLabourBill;
  }
  calculatePartsBill() {

    let sum = 0;
    const rowsCount = this.dataTable.getrows().length;
    for (let i = 0; i < rowsCount; i++) {
      const rowData = this.dataTable.getrowdata(i);
      const currentRate = rowData.totalPrice;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
    }
    this.kcpBill.totalPartsBill = sum;

    this.kcpBill.totalBill = this.kcpBill.totalPartsBill + this.kcpBill.totalLabourBill;
  }

  saveEntity(){
    this.spinnerService.show();
    if(this.kcpBill.id > 0){
      this.kcpBill.saleKcpBillLabourLines = this.labourRateDataTable.getrows();
      this.kcpBill.saleKcpBillPartsLines =this.dataTable.getrows();

      this.service.saveKcpBill(this.kcpBill).subscribe(x=> {
        if(x.entity){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
          this.service.downloadReport(x.entity).subscribe(response => {
            this.base64 = response.base64;
            this.spinnerService.hide();
          });
        }
        else{
          this.spinnerService.hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something Went Wrong' });
        }
      });

    }else{
      this.kcpBill.saleKcpBillLabourLines = this.labourRateDataTable.getrows();
      this.kcpBill.saleKcpBillPartsLines =this.dataTable.getrows();
      this.service.saveKcpBill(this.kcpBill).subscribe(res=> {
        if(res.entity){
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
          this.service.downloadReport(res.entity).subscribe(response => {
            this.base64 = response.base64;
            this.spinnerService.hide();
          });
        }
        else{
          this.spinnerService.hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
        }
      });
    }
  }

  resetForm() {
    // Clear form fields by resetting the form group
    this.kcpBill=null;

    // Clear data bound to the grids
    // Assuming you have references to your jqxGrid instances
    this.dataTable.clear(); // Clear the first grid
    this.labourRateDataTable.clear(); // Clear the second grid

    // Optionally, you can reset any other data or variables related to the grids here

    // Clear any other data or variables as needed
    this.kcpBill.totalPartsBill = null;
    this.kcpBill.totalLabourBill = null;
    this.kcpBill.totalBill = null;
  }

  deleteRow(value: any) {
    debugger;

    if(value === 'part'){
      let values = this.dataTable.selectedrowindexes().reverse();
      console.log(values);
      let rowUid = []; // Initialize rowUid as an array

      (async () => {
        try {
          console.log(values.length);
          for (let i = 0; i < values.length; i++) {
            const rowData = await this.dataTable.getrowdata(values[i]);

            rowUid.push(rowData.uid);
          }

          for (let i = 0; i < rowUid.length; i++) {
            this.dataTable.deleterow(rowUid[i]);

            if(this.dataTable.getcellvalue(i,'id')){
              this.dataTable.setcellvalue(i,'deleted',1);
              console.log(this.dataTable.getrowdata(i));
            }
          }
        } catch (e) {
          console.log(e);
        }
      })();
      this.dataTable.clearselection();
    }else{
      let values = this.labourRateDataTable.selectedrowindexes().reverse();
      console.log(values);
      let rowUid = []; // Initialize rowUid as an array

      (async () => {
        try {
          console.log(values.length);
          for (let i = 0; i < values.length; i++) {
            const rowData = await this.labourRateDataTable.getrowdata(values[i]);
            rowUid.push(rowData.uid);
          }

          for (let i = 0; i < rowUid.length; i++) {
            this.labourRateDataTable.deleterow(rowUid[i]);
            if(this.labourRateDataTable.getcellvalue(i,'id')){
              this.labourRateDataTable.setcellvalue(i,'deleted',1);
              console.log(this.labourRateDataTable.getrowdata(i));
            }

          }
        } catch (e) {
          console.log(e);
        }
      })();
      this.labourRateDataTable.clearselection();
    }



  }







  getPdfDataUrl(): SafeResourceUrl {
    if (!this.pdfDataReceived && this.base64) {
      const dataUrl = `data:application/pdf;base64,${this.base64}`;
      const sanitizedDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);

      // Update the flag to indicate that the response has been received
      this.pdfDataReceived = true;
      this.spinner = false;
      return sanitizedDataUrl;
    } else {
      return '';
    }

  }

  CancelPdf() {
    this.base64 =null;
    this.pdfDataReceived = false;
  }
  fillgridLabour(gridData){

    this.ref.detectChanges();
    if(this.labourRateDataTable !== undefined){
      (this.labourRateDataTable.source() as any)._source.localdata = gridData;
      this.labourRateDataTable.updatebounddata();
      this.labourRateDataTable.refresh();
      if(this.labourRateDataTable.getrows().length > 0){
        this.labourRateDataTable.getselectedrowindexes();
      }
    }
  }

  fillgrid(gridData){

    this.ref.detectChanges();
    if(this.dataTable !== undefined){
      (this.dataTable.source() as any)._source.localdata = gridData;
      this.dataTable.updatebounddata();
      this.dataTable.refresh();
      if(this.dataTable.getrows().length > 0){
        this.dataTable.getselectedrowindexes();
      }
    }
  }
}
