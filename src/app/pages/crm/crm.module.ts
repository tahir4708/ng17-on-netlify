import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorFormComponent } from './vendor/vendor-form/vendor-form.component';
import {CrmRoutingModule} from "./crm-routing.module";
import {SharedModule} from "../../shared/shared.module";
import {jqxDataTableModule} from "jqwidgets-ng/jqxdatatable";
import {jqxWindowModule} from "jqwidgets-ng/jqxwindow";
import {jqxButtonModule} from "jqwidgets-ng/jqxbuttons";
import {NgxSpinnerModule} from "ngx-spinner";
import { ContactFormComponent } from './personal/contact-form/contact-form.component';
import { ContactListComponent } from './personal/contact-list/contact-list.component';
import {jqxInputModule} from "jqwidgets-ng/jqxinput";
import {jqxDateTimeInputModule} from "jqwidgets-ng/jqxdatetimeinput";
import {ReactiveFormsModule} from "@angular/forms";
import {jqxDropDownListModule} from "jqwidgets-ng/jqxdropdownlist";



@NgModule({
  declarations: [
    VendorListComponent,
    VendorFormComponent,
    ContactFormComponent,
    ContactListComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule,
    jqxDataTableModule,
    jqxWindowModule,
    jqxButtonModule,
    NgxSpinnerModule,
    jqxInputModule,
    jqxDateTimeInputModule,
    ReactiveFormsModule,
    jqxDropDownListModule
  ]
})
export class CrmModule { }
