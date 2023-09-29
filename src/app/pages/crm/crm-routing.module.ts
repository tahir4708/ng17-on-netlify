import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VendorListComponent} from "./vendor/vendor-list/vendor-list.component";
import {VendorFormComponent} from "./vendor/vendor-form/vendor-form.component";
import {ContactFormComponent} from "./personal/contact-form/contact-form.component";
import {ContactListComponent} from "./personal/contact-list/contact-list.component";



const routes: Routes = [

  {
    path: 'contact-list',
    component: ContactListComponent,
  },{
    path: 'contact-form',
    component: ContactFormComponent,
  },{
    path: 'contact-form/:id',
    component: ContactFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
