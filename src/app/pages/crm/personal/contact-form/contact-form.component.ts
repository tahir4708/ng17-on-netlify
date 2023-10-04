import {Component, OnInit, ViewChild} from '@angular/core';
import {jqxDropDownListComponent} from "jqwidgets-ng/jqxdropdownlist";
import {jqxDateTimeInputComponent} from "jqwidgets-ng/jqxdatetimeinput";
import {FormBuilder, FormGroup} from "@angular/forms";
import {INV_PRODUCTS} from "../../../inventory/product/product.model";
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../../inventory/product/product.service";
import {BasicLoginService} from "../../../auth/login/basic-login/basic-login.service";
import {ToastrService} from "ngx-toastr";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {ContactService} from "../contact.service";
import {CRM_CONTACT} from "../model/contact.model";

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  @ViewChild('contactType') contactType!: jqxDropDownListComponent;
  @ViewChild('country') country!: jqxDropDownListComponent;
  @ViewChild('city') city!: jqxDropDownListComponent;

  @ViewChild('created_date') created_date: jqxDateTimeInputComponent;
  @ViewChild('modified_date') modified_date: jqxDateTimeInputComponent;

  public componentName: any;
  public formGroup: FormGroup;
  public entity: CRM_CONTACT;
  public currentUser: any;
  public id: any;
  isAddMode: boolean;
  public lovMapCountry: any;
  public lovMapCity: any;
  public lovMapStatus: any;
  public lovMapContactType: any;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              private service: ContactService,
              private loginService: BasicLoginService,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private SpinnerService: NgxSpinnerService,
  ) {
    this.componentName = this.route.snapshot.routeConfig.component.name;
  }

  ngOnInit() {
    debugger;
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.currentUser = JSON.parse(sessionStorage.getItem('user')) ;
    this.service.lovMap().subscribe((data) => {
      this.lovMapContactType = data.lovmap.ContactType;
      this.lovMapCountry = data.lovmap.Country;
      this.lovMapCity = data.lovmap.City;
      this.lovMapStatus = data.lovmap.RecordStatus;

    });
    /**/
    this.formGroup = this.fb.group({
      contact_id:[0],
      first_name:[''],
      last_name:[''],
      contact_title:[''],
      cnic:[''],
      address_line:[''],
      city_id:[],
      country_id:[],
      zip_code:[''],
      contact_type_id:[0],
      contact_type_name:[''],
      mobile_no:[''],
      created_date:[''],
      created_by:[0],
      modified_date:[''],
      modified_by:[0],
      session_id:[0],
      status:[''],
      deleted:[false],
    });

    if (!this.isAddMode) {

      this.SpinnerService.show();
      this.service.getEntityById(this.id)
        .subscribe(x => {
          this.formGroup.patchValue(x.entity);
          this.SpinnerService.hide();
        });
    }
  }

  async saveBrand() {
    if(this.id > 0){
      this.SpinnerService.show();
      this.entity = <CRM_CONTACT>this.formGroup.value;
      this.entity.contact_title = this.entity.first_name + ' '+this.entity.last_name;
      this.entity.modified_by = this.currentUser.user_id;
      this.entity.modified_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      
      this.service.save(this.entity).subscribe((data) => {

        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/crm/contact-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }else{
      debugger;
      this.SpinnerService.show();
      this.entity = this.formGroup.value;
      this.entity.contact_title = this.entity.first_name + ' '+this.entity.last_name;
      this.entity.deleted = false;
      this.entity.created_by = this.currentUser.user_id;
      this.entity.created_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      this.entity.modified_date = this.datePipe.transform(Date.now(),'yyyy-MM-ddThh:mm:hh');
      this.entity.modified_by = this.currentUser.user_id;
      
      this.service.save(this.entity).subscribe((data) => {
        if (data.entity) {
          this.toastr.success('Record Saved', 'Success')
          this.SpinnerService.hide();
          this.router.navigate(['/crm/contact-list']);
        } else {
          this.toastr.error('Error', 'Error')
          this.SpinnerService.hide();
        }

      });
    }
  }
}
