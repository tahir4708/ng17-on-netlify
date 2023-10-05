import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicLoginComponent } from './basic-login.component';
import {BasicLoginRoutingModule} from './basic-login-routing.module';
import {SharedModule} from '../../../../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {NgxSpinnerModule} from "ngx-spinner";
import {ToastModule} from "primeng/toast";
import {MessageModule} from "primeng/message";

@NgModule({
  imports: [
    CommonModule,
    BasicLoginRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    NgxSpinnerModule,
    ToastModule,
    MessageModule
  ],
  declarations: [BasicLoginComponent]
})
export class BasicLoginModule { }
