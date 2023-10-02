import {Component, Injectable, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, RequiredValidator} from '@angular/forms';
import {BasicLoginService} from './basic-login.service';
import {Login_request} from '../../../model/CORE/login_request.model';
import {AngularDeviceInformationService} from 'angular-device-information';
import {Router} from '@angular/router';
import {lovmap} from '../../../model/CORE/lovmap';
import {ToastrService} from "ngx-toastr";
@Component({
  selector: 'app-basic-login',
  templateUrl: './basic-login.component.html',
  styleUrls: ['./basic-login.component.scss']
})
export class BasicLoginComponent implements OnInit {
  public login_request: Login_request;
  public loginForm: UntypedFormGroup;
  public user_data: string;
  public lovmap: lovmap[];
    spinner: any;
  constructor(
    private toast: ToastrService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private deviceInformationService: AngularDeviceInformationService,
    private service: BasicLoginService) {
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit() {
    sessionStorage.clear();
    document.querySelector('body').setAttribute('themebg-pattern', 'theme1');
  }
  login() {
      this.spinner=true;
    this.login_request = <Login_request> this.loginForm.value;

    this.service.save(this.login_request).subscribe((data) => {
        sessionStorage.clear();
        sessionStorage.setItem('user', JSON.stringify(data.entity));
        sessionStorage.setItem('token', data.keyValuePairs.token);
        this.spinner=false;
      // tslint:disable-next-line:no-shadowed-variable
        this.router.navigate(['/dashboard']);

    });
}

}
