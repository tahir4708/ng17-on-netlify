import {Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {KcpBillFormModel} from "../model/kcp-bill-form.model";
import {KcpBillLabourRateLinesModel} from "../model/kcp-bill-labour-rate-lines.model";
import {KcpBillPartsLinesModel} from "../model/kcp-bill-parts-lines.model";
import {CommonModule} from "@angular/common";
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxInputComponent} from "jqwidgets-ng/jqxinput";



@Component({

  selector: 'app-kcp-bill-form',
  templateUrl: './kcp-bill-form.component.html',
  styleUrls: ['./kcp-bill-form.component.scss']
})
export class KcpBillFormComponent implements OnInit {
  public dataAdapter: any;
  public columns: any;
  public labourRateColumns: any;
  public source: any;
  kcpBill: KcpBillFormModel = {
    totalLabourBill: undefined, totalPartsBill: undefined,
    id: 0, // Initialize with a default value or the appropriate initial value
    billNo: '',
    workOrderNo: '',
    date: '',
    kcpBillPartsLines: [],
    kcpBillLabourRatesLines: [],
    partsLinesTotal: 0,
    labourRatesLinesTotal: 0,
    totalBill: 0
    // Other properties...
  };
  rates: any;
  labourRateLines: KcpBillLabourRateLinesModel[] = [];
  partsLine: KcpBillPartsLinesModel;

  @ViewChild('dataTable') dataTable: jqxGridComponent ;
  @ViewChild('labourRateDataTable') labourRateDataTable: jqxGridComponent ;
  @ViewChild('labourRateInputComponent') labourRateInputComponent: jqxInputComponent;

  constructor(public service: InventoryService) {}
  value: any;
  ngOnInit() {
    this.initTable();
    this.service.getKcpLabourRates().subscribe(x=>{
        this.rates = x.entity;
    });
  }

  initTable(){
    this.columns = [
      { text: 'work_id', dataField: 'work_id', hidden:true },
      // { text: 'product id', dataField: 'product_id',  editable:false,hidden:true },
      { text: 'Product', dataField: 'product_name', editable:true},
      { text: 'Product Price', dataField: 'product_price', editable: true },
      {
        text: 'Quantity', dataField: 'quantity', editable: true,

      },
      { text: 'Tax %', dataField: 'allowed_tax',
        cellbeginedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void => {
          console.log(row);
          const  transaction: any = {};
          transaction.product_price = this.dataTable.getcellvalue(row, 'product_price');
          transaction.quantity = this.dataTable.getcellvalue(row, 'quantity');
          const total_price = transaction.product_price * transaction.quantity;
          this.dataTable.setcellvalue(row,'total_price_of_item',total_price);
        },
        cellendedit: (row: number, datafield: string, columntype: any, oldvalue: any, newvalue: any): void=>{

          const  transaction: any = {};
          transaction.product_price = this.dataTable.getcellvalue(row, 'product_price');
          transaction.quantity = this.dataTable.getcellvalue(row, 'quantity');
          transaction.tax =newvalue;
          const percentage = transaction.tax / 100;
          const priceAfterTax = parseInt(transaction.product_price ) + parseFloat((percentage*transaction.product_price).toFixed(2));
          const quantity = transaction.quantity;
          var total_price = priceAfterTax * quantity;
          this.dataTable.setcellvalue(row,'total_price_of_item',total_price);
        }},
      { text: 'Total', dataField: 'total_price_of_item' ,editable: false },
    ];

    this.labourRateColumns = [
      { text: 'work rate id', dataField: 'work_rate_id',hidden:'true', width: 300 },
      { text: 'vehicle type id', dataField: 'vehicle_type_id', width: 300,hidden:'true' },
      { text: 'vehicle category id', dataField: 'vehicle_category_id', width: 300 ,hidden:'true'},

      { text: 'existing rate', dataField: 'existing_rate', width: 300 ,hidden:'true'},
      { text: 'work item id', dataField: 'work_item_id', width: 300 ,hidden:'true'},
      {
        text: 'Rate Description',
        datafield: 'rate_description',
        displayfield: 'name',
        columntype: 'dropdownlist',
        createeditor: function (row, value, editor) {
          let selectedItem; // Declare selectedItem outside the scope of the 'select' event handler
          this.service.getKcpLabourRates().subscribe(x => {
            editor.jqxDropDownList({
              filterable: true,
              searchMode: 'containsignorecase',
              source: x.entity,
              displayMember: 'name',
              valueMember: 'category_id'
            });

            // Add an event listener for the 'select' event
            editor.on('select', function (event) {
              selectedItem = event.args.item;
              console.log(row, 'Selected Value:', selectedItem.originalItem.current_rate);

              // Set the cell value here
              this.labourRateDataTable.setcellvalue(row, 'current_rate', selectedItem.originalItem.current_rate);
            }.bind(this)); // Bind 'this' to the event handler function
          });
        }.bind(this)
      },








      { text: 'Rate', dataField: 'current_rate' },
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
    debugger;
    const newRow: KcpBillLabourRateLinesModel = {
      id: undefined,
      workItemId: undefined,
      workItemName: undefined,
      vehicleCategoryId: undefined,
      vehicleCategoryName: undefined,
      vehicleTypeId: undefined,
      vehicleTypeName: undefined,
      labourRate: undefined
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
      const currentRate = rowData.current_rate;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
    }
    this.kcpBill.totalLabourBill = sum;
  }
  calculatePartsBill() {

    let sum = 0;
    const rowsCount = this.dataTable.getrows().length;
    for (let i = 0; i < rowsCount; i++) {
      const rowData = this.dataTable.getrowdata(i);
      const currentRate = rowData.total_price_of_item;
      sum += parseFloat(currentRate); // Assuming current_rate is a numeric field
    }
    this.kcpBill.totalPartsBill = sum;
  }
}
