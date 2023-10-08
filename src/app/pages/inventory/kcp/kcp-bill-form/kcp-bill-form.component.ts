import {ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, Renderer2, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {KcpBillFormModel} from "../model/kcp-bill-form.model";
import {KcpBillLabourRateLinesModel} from "../model/kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "../model/kcp-bill-parts-lines.model";

import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
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
  public labourDataAdapter: any;
  public source: any;
  kcpBill: KcpBillFormModel = {
    vehicleName: '',
    vehicleNo: '',
    totalLabourBill: 0,
    totalPartsBill: 0,
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
  public id: any;
  public isAddMode: boolean=false;
  spinner: boolean = false;
  lovMapLabourRates: any;
  public pdfDataUrl: SafeResourceUrl;

  public requiredMessage: string;
  constructor(public service: InventoryService,
              public fb: FormBuilder,
              private router: Router,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private ref: ChangeDetectorRef,
              private datePipe: DatePipe,
              private messageService: MessageService,
              private spinnerService: NgxSpinnerService) {

    this.spinnerService.show();

  }
  ngOnInit() {
debugger;
    this.spinnerService.show();
    this.id = this.route.snapshot.params['id'];

    this.isAddMode = !this.id;

    if(this.lovMapLabourRates === undefined){
      this.service.getKcpLabourRates().subscribe(x => {

        this.lovMapLabourRates = x.entity;
        this.spinnerService.hide();

      });
    }

    if(this.id > 0 && this.id != undefined){

      this.spinnerService.show();
      this.service.getKcpAllBillById(this.id).subscribe(x=>{

        this.kcpBill = x.entity;
        const formattedDate = this.datePipe.transform(this.kcpBill.date, 'yyyy-MM-dd');
        this.kcpBill.date =formattedDate;
        this.fillgrid(x.entity.saleKcpBillPartsLines);
        this.fillgridLabour((x.entity.saleKcpBillLabourLines))
        this.formGroup.patchValue(x.entity);
        this.spinnerService.hide();
      })
    }


    this.initTable();

    this.formGroup = this.fb.group({
      id: [0],
      billNo: ['', Validators.required],
      vehicleNo: ['',Validators.required],
      vehicleName: ['',Validators.required],
      workOrderNo: ['',Validators.required],
      date: [this.kcpBill.date],
      totalBill: [0],
      totalPartsBill: [0],
      totalLabourBill: [0],
      saleKcpBillLabourLines: this.fb.array([]),
      saleKcpBillPartsLines: this.fb.array([]),
      deleted: false
    });
    const formattedDate = this.datePipe.transform(this.kcpBill.date, 'yyyy-MM-dd');

    this.formGroup.patchValue({ date: formattedDate });

  }

  initTable(){
    this.columns = [
      { text: 'work_id', dataField: 'workId', hidden:true },
      // { text: 'product id', dataField: 'product_id',  editable:false,hidden:true },
      { text: 'Product', dataField: 'productName', editable:true, width:'60%'},
      {
        text: 'Quantity', dataField: 'quantity', editable: true,width:'9%',
      },
      { text: 'Per Item Price', dataField: 'perItemPrice', editable: true , width:'10%',
        cellvaluechanging : (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {
        debugger;
        const perItemPrice = newvalue;
            const quantity = this.dataTable.getcellvalue(row,'quantity');
            const tax = 1.2;

            const perItemPriceWithTax = (perItemPrice *1.2);
            this.dataTable.setcellvalue(row,'perItemPriceWithTax',perItemPriceWithTax);

            const totalPrice = perItemPriceWithTax * quantity;
            this.dataTable.setcellvalue(row,'totalPrice',totalPrice);
        }
      },
      { text: 'With Tax', dataField: 'perItemPriceWithTax', editable: false,width:'9%' },


      { text: 'Total', dataField: 'totalPrice' ,editable: false ,width:'9%'},
      { text: 'deleted', dataField: 'deleted' ,hidden: 'true' },
    ];

    this.labourRateColumns = [
      { text: 'work rate id', dataField: 'id',hidden:'true' },
      { text: 'work item id', dataField: 'workItemId' ,hidden:'true'},

      {
        text: 'Rate Description',
        dataField: 'label',
        columntype: 'dropdownlist',
        displayfield: 'label',
        width: '70%',
        initeditor: (row, cellvalue, editor, celltext, cellwidth, cellheight) => {
          editor.jqxDropDownList({
            filterable: true,
            searchMode: 'containsignorecase',
            source: this.lovMapLabourRates,
            displayMember: 'label',
            valueMember: 'value'
          });
        },
        createeditor: (row, value, editor) => {
          editor.jqxDropDownList({
            filterable: true,
            searchMode: 'containsignorecase',
            source: this.lovMapLabourRates,
            displayMember: 'label',
            valueMember: 'value'
          });
        },
        cellendedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any) => {


        },
        cellvaluechanging: (row, column, columntype, oldvalue, newvalue) => {

          const workItemId = this.lovMapLabourRates.find(item => item.label === newvalue)?.value;
          this.labourRateDataTable.setcellvalue(row,'workItemId',workItemId);
          const labourRate =this.lovMapLabourRates.find(item => item.label === newvalue)?.rate;
          this.labourRateDataTable.setcellvalue(row,'labourRate',labourRate);
          const description =this.lovMapLabourRates.find(item => item.label === newvalue)?.label;
          this.labourRateDataTable.setcellvalue(row,'label',description);

          this.labourRateDataTable.getcellvalue(row,'quantity');
          const rowData = this.labourRateDataTable.getrowdata(row);

          debugger;
          const total=this.labourRateDataTable.getcellvalue(row,'quantity') * labourRate;
          this.labourRateDataTable.setcellvalue(row, 'totalPrice',total);

          // return the old value, if the new value is empty.
          if (newvalue == "") return oldvalue;
        }
      },
      {text: 'Quantity', dataField: 'quantity', width: '7%',
        cellvaluechanging: (row, column, columntype, oldvalue, newvalue) => {
        debugger;
        const labourRate = this.labourRateDataTable.getcellvalue(row,'labourRate')
        const total=newvalue * labourRate;
            this.labourRateDataTable.setcellvalue(row, 'totalPrice',total);

        }
      },



      { text: 'Rate', dataField: 'labourRate', width: '10%',
        cellvaluechanging: (row, column, columntype, oldvalue, newvalue) => {
          debugger;
          const labourRate = newvalue
          const quantity = this.labourRateDataTable.getcellvalue(row,'quantity')
          const total=quantity * newvalue;
          this.labourRateDataTable.setcellvalue(row, 'totalPrice',total);

        }},
      { text: 'Total Price', dataField: 'totalPrice',width: '10%', editable: false },
      { text: 'deleted', dataField: 'deleted', hidden: 'true',width: '10%' },
    ];
  }

  addRowPartLine() {
    const row: KcpBillPartsLinesModel = {
      perItemPriceWithTax:0,
      deleted: false,
      id: undefined,
      perItemPrice: 0,
      productName: '',
      quantity: 1,
      taxPercentage: 0,
      totalPrice: 0
    };
    var rows = this.dataTable.getrows();
    this.dataTable.addrow(rows.length+1,row);
  }

  addRowLabourRateLine() {

    const newRow: KcpBillLabourRateLinesModel = {
      quantity: 1, totalPrice: 0,
      deleted: false,
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
    debugger;
    let sum = 0;
    const rowsCount = this.labourRateDataTable.getrows().length;
    for (let i = 0; i < rowsCount; i++) {
      const rowData = this.labourRateDataTable.getrowdata(i);
      const currentRate = rowData.totalPrice;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
      this.kcpBill.totalLabourBill = sum;
    }

    if(this.kcpBill.totalPartsBill == undefined || rowsCount==0) {
      this.kcpBill.totalPartsBill =0
    }

    if(this.kcpBill.totalLabourBill == undefined) {
      this.kcpBill.totalLabourBill =0
    }

    this.kcpBill.totalBill = this.kcpBill.totalPartsBill + this.kcpBill.totalLabourBill;
  }
  calculatePartsBill() {
    debugger;
    let sum = 0;
    const rowsCount = this.dataTable.getrows().length;
    for (let i = 0; i < rowsCount; i++) {
      const rowData = this.dataTable.getrowdata(i);
      const currentRate = rowData.totalPrice;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
      this.kcpBill.totalPartsBill = sum;
    }

    if(this.kcpBill.totalLabourBill == undefined) {
      this.kcpBill.totalLabourBill =0
    }
    if(this.kcpBill.totalPartsBill == undefined || rowsCount==0) {
      this.kcpBill.totalPartsBill =0
    }

    this.kcpBill.totalBill = this.kcpBill.totalLabourBill + this.kcpBill.totalPartsBill;
  }

  saveEntity(){

    if(this.formGroup.valid){
      this.spinnerService.show();
      if(this.id > 0){
        this.kcpBill.id = this.id;
        this.kcpBill.saleKcpBillLabourLines = this.labourRateDataTable.getrows();
        this.kcpBill.saleKcpBillPartsLines =this.dataTable.getrows();

        this.service.saveKcpBill(this.kcpBill).subscribe(x=> {
          if(x.entity){
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record Updated Successfully' });
            this.id = x.entity;
            this.downloadFile();
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
            this.id = res.entity;
            this.downloadFile();
          }
          else{
            this.spinnerService.hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
          }
        });

      }
      this.spinnerService.hide();
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Form Value Required' });
    }

  }

  resetForm() {

    this.formGroup.reset();
      this.labourRateDataTable.clear();
      this.dataTable.clear();

  }

  deleteRow(value: any) {
    debugger;

    if(value === 'part'){
      let values = this.dataTable.selectedrowindexes().reverse();
      let rowUid = []; // Initialize rowUid as an array

      (async () => {
        try {
          for (let i = 0; i < values.length; i++) {
            const rowData = await this.dataTable.getrowdata(values[i]);

            rowUid.push(rowData.uid);
          }

          for (let i = 0; i < rowUid.length; i++) {
            this.dataTable.deleterow(rowUid[i]);

            if(this.dataTable.getcellvalue(i,'id')){
              this.dataTable.setcellvalue(i,'deleted',false);
            }

          }
        } catch (e) {

        }

       this.calculatePartsBill();
      })

      ();
      debugger;

      this.dataTable.clearselection();
    }else{
      let values = this.labourRateDataTable.selectedrowindexes().reverse();
      let rowUid = []; // Initialize rowUid as an array

      (async () => {
        try {
          for (let i = 0; i < values.length; i++) {
            const rowData = await this.labourRateDataTable.getrowdata(values[i]);
            rowUid.push(rowData.uid);
          }

          for (let i = 0; i < rowUid.length; i++) {
            this.labourRateDataTable.deleterow(rowUid[i]);
            if(this.labourRateDataTable.getcellvalue(i,'id')){
              this.labourRateDataTable.setcellvalue(i,'deleted',false);
            }
          }
        } catch (e) {

        }
        this.calculateCurrentRateSum();
      })();

      this.labourRateDataTable.clearselection();
      console.log(this.kcpBill);
    }



  }








  CancelPdf() {
    this.base64 =  null;
    this.pdfDataUrl =null;
    this.spinnerService.hide();

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

  downloadFile(): void {
    this.spinnerService.show();
    this.service.downloadReport(this.id).subscribe(data => {

      // Check if the data is a valid base64 string
      if (/^[A-Za-z0-9+/]*={0,2}$/.test(data.base64)) {
        debugger;
        this.base64 = data.base64;
        // Decode the base64 data
        const binaryData = atob(data.base64);
        const length = binaryData.length;
        const bytes = new Uint8Array(length);

        for (let i = 0; i < length; i++) {
          bytes[i] = binaryData.charCodeAt(i);
        }

        // Create a Blob from the Uint8Array
        const blob = new Blob([bytes], { type: 'application/pdf' });

        // Create a data URL from the Blob
        // this.pdfDataUrl = URL.createObjectURL(blob);
        this.pdfDataUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        this.spinnerService.hide();
      } else {
        this.spinnerService.hide();
        // Handle the error as needed
      }
    });
  }



}
