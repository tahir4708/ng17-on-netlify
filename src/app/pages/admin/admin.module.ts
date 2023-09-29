import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuListComponent } from './menu/menu-list/menu-list.component';
import { MenuFormComponent } from './menu/menu-form/menu-form.component';
import {TreeGridModule} from "@syncfusion/ej2-angular-treegrid";
import {AdminRoutingModule} from "./admin-routing.module";
import {TreeTableModule} from "primeng/treetable";



@NgModule({
  declarations: [
    MenuListComponent,
    MenuFormComponent
  ],
  imports: [
    CommonModule,
    TreeGridModule,
    AdminRoutingModule,
    TreeTableModule
  ]
})
export class AdminModule { }
