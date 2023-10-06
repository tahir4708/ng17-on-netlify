import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {InventoryService} from "../../inventory-service.service";
import {jqxGridComponent} from "jqwidgets-ng/jqxgrid";
import {jqxPanelComponent} from "jqwidgets-ng/jqxpanel";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {TableComponentComponent} from "../../../admin/framework/table-component/table-component.component";
import {NgxSpinnerService} from "ngx-spinner";

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
              private ref: ChangeDetectorRef,
              private router: Router,
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private spinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.service.getKcpAllBills().subscribe(response => {
      this.data = response.entity;

      this.source = {
        dataType: 'json',
        dataFields: [
          { name: 'id', type: 'int'},
          { name: 'billNo', type: 'string'},
          { name: 'vehicleNo', type: 'string'},
          { name: 'vehicleName', type: 'string'},
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
        { text: 'Bill No', dataField: 'billNo', width: '10%' },
        { text: 'Vehicle No', dataField: 'vehicleNo', width: '10%' },
        { text: 'Vehicle', dataField: 'vehicleName', width: '20%' },
        { text: 'Work Order No', dataField: 'workOrderNo', width: '10%' },
        { text: 'Total Bill', dataField: 'totalBill', width: '10%' },
        { text: 'Total Parts Bill', dataField: 'totalPartsBill', width: '10%'},
        { text: 'Total Labour Bill', dataField: 'totalLabourBill', width: '10%' },
        { text: 'Date', dataField: 'date', width: '20%' }




      ];


      console.log(this.source);
      this.dataAdapter = new jqx.dataAdapter(this.source);
      console.log(this.dataAdapter);
      this.spinnerService.hide();
    });
  }

  public editItem(id: number) {
    console.log(11);
    this.router.navigate(['/inventory/kcp-bill-form/'+id])
  }

  public  deleteItem(id: number) {
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

  onRowdoubleclick($event: any) {

   this.router.navigate(['/inventory/kcp-bill-form/'+$event.args.row.bounddata.id])
  }
}
