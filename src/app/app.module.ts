import { BrowserModule } from '@angular/platform-browser';
import {NgModule, NO_ERRORS_SCHEMA} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { AdminComponent } from './layout/admin/admin.component';
import { BreadcrumbsComponent } from './layout/admin/breadcrumbs/breadcrumbs.component';
import { TitleComponent } from './layout/admin/title/title.component';
import { AuthComponent } from './layout/auth/auth.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor, authInterceptorProviders} from './pages/auth/Authentication/AuthInterceptor';
import {InventoryModule} from './pages/inventory/inventory.module';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ToastrModule} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import { ReactiveFormsModule } from '@angular/forms';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {TabViewModule} from "primeng/tabview";
import {ButtonModule} from "primeng/button";
import {DashboardDefaultModule} from "./pages/dashboard/dashboard-default/dashboard-default.module";
import {PdfViewerComponent, PdfViewerModule} from 'ng2-pdf-viewer';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    BreadcrumbsComponent,
    TitleComponent,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right'
    }), // ToastrModule added
    InputTextModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxMatSelectSearchModule,
    NgbModule,
    TabViewModule,
    ButtonModule,
    DashboardDefaultModule,
    InputTextModule,
    PdfViewerModule,
    ProgressSpinnerModule,


  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },,DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
