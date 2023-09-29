import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MenuListComponent} from "./menu/menu-list/menu-list.component";



const routes: Routes = [

  {
    path: 'menu-list',
    component: MenuListComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
