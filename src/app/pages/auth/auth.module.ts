import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgxSpinnerModule} from "ngx-spinner";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    HttpClientModule,
    ProgressSpinnerModule
  ],
  declarations: []
})
export class AuthModule { }
