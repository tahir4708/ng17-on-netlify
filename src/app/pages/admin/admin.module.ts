import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import {TreeGridModule} from "@syncfusion/ej2-angular-treegrid";
import {AdminRoutingModule} from "./admin-routing.module";
import {TreeTableModule} from "primeng/treetable";
import { TableComponentComponent } from './framework/table-component/table-component.component';



@NgModule({
  declarations: [
    MenuListComponent,
    MenuFormComponent,
    TableComponentComponent
  ],
  imports: [
    CommonModule,
    TreeGridModule,
    AdminRoutingModule,
    TreeTableModule
  ]
})
export class AdminModule { }
