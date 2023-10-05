import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BrandsComponent} from './brands/brands.component';
import {BrandsListComponent} from './brands/brands-list/brands-list.component';
import {ProductFormComponent} from "./product/product-form/product-form.component";
import {ProductListComponent} from "./product/product-list/product-list.component";
import {PurchaseOrderListComponent} from "./purchase/purchase-order-list/purchase-order-list.component";
import {PurchaseOrderFormComponent} from "./purchase/purchase-order-form/purchase-order-form.component";
import {SaleInvoiceListComponent} from "./sale/sale-invoice/sale-invoice-list/sale-invoice-list.component";
import {SaleInvoiceFormComponent} from "./sale/sale-invoice/sale-invoice-form/sale-invoice-form.component";
import {KcpBillFormComponent} from "./kcp/kcp-bill-form/kcp-bill-form.component";
import {KcpBillListComponent} from "./kcp/kcp-bill-list/kcp-bill-list.component";
import {PdfViewerComponent} from "./pdf-viewer/pdf-viewer.component";


const routes: Routes = [
  {
  path: 'brands-form',
  component: BrandsComponent,
  }, {
  path: 'brands-list',
  component: BrandsListComponent,
  }, {
  path: 'brands-form/:id',
  component: BrandsComponent,
  }, {
    path: 'product-form',
    component: ProductFormComponent,
  }, {
    path: 'product-form/:id',
    component: ProductFormComponent,
  }, {
    path: 'product-list',
    component: ProductListComponent,
  },{
    path: 'purchase-list',
    component: PurchaseOrderListComponent,
  },{
    path: 'purchase-form',
    component: PurchaseOrderFormComponent,
  },{
    path: 'purchase-form/:id',
    component: PurchaseOrderFormComponent,
  },{
    path: 'sale-form/:id',
    component: SaleInvoiceFormComponent,
  },{
    path: 'sale-invoice-form',
    component: SaleInvoiceFormComponent,
  },{
    path: 'sale-invoice-list',
    component: SaleInvoiceListComponent,
  },{
    path: 'kcp-bill-form',
    component: KcpBillFormComponent,
  },{
    path: 'kcp-bill-form/:id',
    component: KcpBillFormComponent,
  },{
    path: 'kcp-bill-list',
    component: KcpBillListComponent,
  },
  {
  path:'pdf-viewer/:base64',
    component: PdfViewerComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
