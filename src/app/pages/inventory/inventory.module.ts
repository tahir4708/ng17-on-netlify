import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { BrandsComponent } from './brands/brands.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrandsListComponent } from './brands/brands-list/brands-list.component';
import {SharedModule} from '../../shared/shared.module';
import {NgxSpinnerModule} from "ngx-spinner";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {jqxDropDownListModule} from "jqwidgets-ng/jqxdropdownlist";
import {jqxInputModule} from "jqwidgets-ng/jqxinput";
import {MatButtonModule} from "@angular/material/button";
import {jqxDateTimeInputModule} from "jqwidgets-ng/jqxdatetimeinput";
import {jqxDataTableModule} from "jqwidgets-ng/jqxdatatable";
import {jqxWindowModule} from "jqwidgets-ng/jqxwindow";
import {jqxButtonModule} from "jqwidgets-ng/jqxbuttons";
import { PurchaseOrderListComponent } from './purchase/purchase-order-list/purchase-order-list.component';
import { PurchaseOrderFormComponent } from './purchase/purchase-order-form/purchase-order-form.component';
import {jqxGridModule} from "jqwidgets-ng/jqxgrid";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SelectModule} from "ng-select";
import {NgSelectModule} from "@ng-select/ng-select";
import { SaleInvoiceFormComponent } from './sale/sale-invoice/sale-invoice-form/sale-invoice-form.component';
import { SaleInvoiceListComponent } from './sale/sale-invoice/sale-invoice-list/sale-invoice-list.component';
import { KcpBillFormComponent } from './kcp/kcp-bill-form/kcp-bill-form.component';
import { KcpBillListComponent } from './kcp/kcp-bill-list/kcp-bill-list.component';
import {AutoComplete, AutoCompleteModule} from "primeng/autocomplete";
import {TableModule} from "primeng/table";
import {DropdownModule} from "primeng/dropdown";
import {MessageModule} from "primeng/message";
import {DeferModule} from "primeng/defer";
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import {PdfViewerModule} from "ng2-pdf-viewer";
import {ToastModule} from "primeng/toast";
import {ProgressSpinnerModule} from "primeng/progressspinner";


@NgModule({
  declarations:
    [BrandsComponent, BrandsListComponent, ProductListComponent, ProductFormComponent, PurchaseOrderListComponent, PurchaseOrderFormComponent, SaleInvoiceFormComponent, SaleInvoiceListComponent, KcpBillFormComponent, KcpBillListComponent, PdfViewerComponent],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    NgxSpinnerModule,
    ButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    jqxDropDownListModule,
    jqxInputModule,
    MatButtonModule,
    jqxDateTimeInputModule,
    jqxDataTableModule,
    jqxWindowModule,
    jqxButtonModule,
    jqxGridModule,
    NgbModule,
    NgSelectModule,
    AutoCompleteModule,
    TableModule,
    DropdownModule,
    MessageModule,
    DeferModule,
    ToastModule,
    ProgressSpinnerModule

  ]
})
export class InventoryModule { }
