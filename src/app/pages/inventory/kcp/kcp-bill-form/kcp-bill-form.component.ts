import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {KcpBillFormModel} from "../model/kcp-bill-form.model";
import {KcpBillLabourRateLinesModel} from "../model/kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "../model/kcp-bill-parts-lines.model";

import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {forEach} from "@angular-devkit/schematics";




@Component({

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
    SaleKcpBillPartsLines: [],
    SaleKcpBillLabourLines: [],
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

  constructor(public service: InventoryService,
              public fb: FormBuilder,
              private router: Router,
              private sanitizer: DomSanitizer) {


  }
  ngOnInit() {
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
          console.log(row);

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
          const percentage = transaction.tax / 100;
          const priceAfterTax = parseInt(transaction.product_price ) + parseFloat((percentage*transaction.product_price).toFixed(2));
          const quantity = transaction.quantity;
          var total_price = priceAfterTax * quantity;
          this.dataTable.setcellvalue(row,'totalPrice',total_price);
        }},
      { text: 'Total', dataField: 'totalPrice' ,editable: false },
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
          let selectedItem; // Declare selectedItem outside the scope of the 'select' event handler
          this.service.getKcpLabourRates().subscribe(x => {
            editor.jqxDropDownList({
              filterable: true,
              searchMode: 'containsignorecase',
              source: x.entity,
              displayMember: 'label',
              valueMember: 'label'
            });

            // Add an event listener for the 'select' event
            editor.on('select', function (event) {
              selectedItem = event.args.item;

              this.labourRateDataTable.setcellvalue(row, 'description', selectedItem.label); // Set description to the label
              console.log(this.labourRateDataTable.getcellvalue(row,'description'));
              this.labourRateDataTable.setcellvalue(row, 'workItemId', selectedItem.originalItem.value);
              this.labourRateDataTable.setcellvalue(row, 'labourRate', selectedItem.originalItem.rate);
            }.bind(this)); // Bind 'this' to the event handler function
          });
        }.bind(this),
        cellendedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {
          console.log(this.dataTable.getcellvalue(row,'description'));
        }
      },


      { text: 'Rate', dataField: 'labourRate' },
    ];
  }

  addRowPartLine() {
    const row: KcpBillPartsLinesModel = {
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

  addLabourBillLines(): void{
    (this.formGroup.controls.saleKcpBillLabourLines as FormArray).push(
        this.fb.group({
          id:[0],
          workItemId:[0],
          description: [''],
          labourRate:[0]
        })
    )
  }

  addPartsBillLines(): void{
    (this.formGroup.controls.saleKcpBillLabourLines as FormArray).push(
        this.fb.group({
          id:[0],
          productName:[''],
          quantity: [0],
          taxPercentage:[0],
          perItemPrice:[0],
          totalPrice:[0]
        })
    )
  }

  saveEntity(){

    if(this.kcpBill.id > 0){
      this.kcpBill.SaleKcpBillLabourLines = this.labourRateDataTable.getrows();
      this.kcpBill.SaleKcpBillPartsLines =this.dataTable.getrows();
      console.log(this.kcpBill);

      this.service.saveKcpBill(this.kcpBill).subscribe(x=> {
        console.log(x);
      });

    }else{

      this.kcpBill.SaleKcpBillLabourLines = this.labourRateDataTable.getrows();
      this.kcpBill.SaleKcpBillPartsLines =this.dataTable.getrows();
      console.log(JSON.stringify(this.kcpBill) );
      this.service.saveKcpBill(this.kcpBill).subscribe(res=> {

        this.service.downloadReport(res.entity).subscribe(response => {
          this.base64 = response.base64;

        });
      });
    }
  }

  resetForm() {
    // Clear form fields by resetting the form group
    this.formGroup.reset();

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

      const selectedRows = this.dataTable.getselectedrowindexes();
      selectedRows.forEach(rowIndex => {
        // Perform your operations on each selected row here
        const rowData = this.dataTable.getrowdata(rowIndex);
        // rowData contains the data of the selected row
        this.dataTable.deleterow(rowIndex);
        console.log('Selected Row Data:', rowIndex);
      });
    }else{
      const selectedRows = this.labourRateDataTable.getselectedrowindexes();
      selectedRows.forEach(rowIndex => {
        // Perform your operations on each selected row here
        const rowData = this.labourRateDataTable.getrowdata(rowIndex);
        // rowData contains the data of the selected row
        this.labourRateDataTable.deleterow(rowIndex);
        console.log('Selected Row Data:', rowIndex);
      });
    }

  }



  getPdfDataUrl(): SafeResourceUrl {
    if (!this.pdfDataReceived && this.base64) {
      const dataUrl = `data:application/pdf;base64,${this.base64}`;
      const sanitizedDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);

      // Update the flag to indicate that the response has been received
      this.pdfDataReceived = true;

      return sanitizedDataUrl;
    } else {
      return '';
    }
  }

  CancelPdf() {
    this.base64 =null;
    this.pdfDataReceived = false;
  }
}
