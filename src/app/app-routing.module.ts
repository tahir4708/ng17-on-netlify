import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './layout/admin/admin.component';
import {AuthComponent} from './layout/auth/auth.component';
import {AuthGuard} from './pages/auth/Authentication/AuthGuard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
      }, {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/dashboard/dashboard-default/dashboard-default.module').then(m => m.DashboardDefaultModule)
      },{
        path: 'inventory',
         canActivate: [AuthGuard],
        loadChildren: () => import('./pages/inventory/inventory.module').then(m => m.InventoryModule)
      },{
        path: 'crm',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/crm/crm.module').then(m => m.CrmModule)
      },{
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule)
      }
    ]
  },
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
