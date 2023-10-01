import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxPanelComponent} from "jqwidgets-ng/jqxpanel";

@Component({
  selector: 'app-kcp-bill-list',
  templateUrl: './kcp-bill-list.component.html',
  styleUrls: ['./kcp-bill-list.component.scss']
})
export class KcpBillListComponent implements OnInit {
  @ViewChild('dataTable') dataTable: jqxGridComponent ;
  @ViewChild('myPanel', { static: false }) myPanel: jqxPanelComponent;
  @ViewChild('eventsLog', { static: false }) eventsLog: ElementRef;
  @ViewChild('pagingInfo', { static: false }) pagingInfo: ElementRef;
  dataAdapter: any;
  columns: any;
  data: any;
  source: any;

  constructor(public service: InventoryService,
              private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.getKcpAllBills().subscribe(response => {
      this.data = response.entity;

      this.source = {
        dataType: 'json',
        dataFields: [
          { name: 'id', type: 'int'},
          { name: 'billNo', type: 'string'},
          { name: 'workOrderNo', type: 'string'},
          { name: 'totalBill', type: 'decimal'},
          { name: 'totalPartsBill', type: 'decimal'},
          { name: 'totalLabourBill', type: 'decimal'},
          { name: 'date', type: 'DateTime'},

        ],
        id: 'id',
        localdata: this.data
      };

      this.columns = [
        { text: 'id', dataField: 'id', width: 300, hidden: true },
        { text: 'Bill No', dataField: 'billNo', width: '15%' },
        { text: 'Work Order No', dataField: 'workOrderNo', width: '15%' },
        { text: 'Total Bill', dataField: 'totalBill', width: '10%' },
        { text: 'Total Parts Bill', dataField: 'totalPartsBill', width: '15%'},
        { text: 'Total Labour Bill', dataField: 'totalLabourBill', width: '15%' },
        { text: 'Date', dataField: 'date', width: '15%' },
        { text: 'Action', dataField: 'Action', width: '15%',
          cellsRenderer: (row, column, value) => {
            const buttonContainerStyle = `
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `;

            const editButton = `
      <div style="${buttonContainerStyle}">
        <button style="background-color: #007bff; color: white; padding: 5px 10px; border: none; border-radius: 4px; margin-right: 5px; cursor: pointer;" onclick="editItem(${value})">Edit</button>
        <button style="background-color: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;" onclick="deleteItem(${value})">Delete</button>
      </div>
    `;

            return editButton;
          },
        },
      ];


      console.log(this.source);
      this.dataAdapter = new jqx.dataAdapter(this.source);
      console.log(this.dataAdapter);
    });
  }

  editItem(id: number) {
    // Handle edit action here using the item's ID
    // For example, you can open a modal or navigate to an edit page
    console.log('Editing item with ID:', id);
  }

  deleteItem(id: number) {
    // Handle delete action here using the item's ID
    // For example, you can confirm the deletion and send an API request
    console.log('Deleting item with ID:', id);
  }
  getEntityListBySearch($event: KeyboardEvent) {

  }

  onPageChanged(event: any): void {
    this.eventsLog.nativeElement.style.display = 'block';
    let loggedElements = document.getElementsByClassName('logged');
    if (loggedElements.length >= 5) {
      this.myPanel.clearcontent();
    }
    let args = event.args;
    let eventData = 'pagechanged <div>Page:' + args.pagenum + ', Page Size: ' + args.pagesize + '</div>';
    this.myPanel.prepend('<div class="logged" style="margin-top: 5px;">' + eventData + '</div>');
    // get page information.
    let paginginformation = this.dataTable.getpaginginformation();
    this.pagingInfo.nativeElement.innerHTML = '<div style="margin-top: 5px;">Page:' + paginginformation.pagenum + ', Page Size: ' + paginginformation.pagesize + ', Pages Count: ' + paginginformation.pagescount + '</div>';
  }
  onPageSizeChanged(event: any): void {
    this.eventsLog.nativeElement.style.display = 'block';
    this.myPanel.clearcontent();
    let args = event.args;
    let eventData = 'pagesizechanged <div>Page:' + args.pagenum + ', Page Size: ' + args.pagesize + ', Old Page Size: ' + args.oldpagesize + '</div>';
    this.myPanel.prepend('<div style="margin-top: 5px">' + eventData + '</div>');
    // get page information.
    let paginginformation = this.dataTable.getpaginginformation();
    this.pagingInfo.nativeElement.innerHTML = '<div style="margin-top: 5px;">Page:' + paginginformation.pagenum + ', Page Size: ' + paginginformation.pagesize + ', Pages Count: ' + paginginformation.pagescount + '</div>';
  }
}
