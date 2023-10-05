import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgxSpinnerModule} from "ngx-spinner";
import {MessageService} from "primeng/api";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    HttpClientModule,
    ProgressSpinnerModule
  ],
  declarations: [],
  providers: [MessageService],
})
export class AuthModule { }
