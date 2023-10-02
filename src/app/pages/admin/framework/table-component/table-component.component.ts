import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {InventoryService} from "../../../inventory/inventory-service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.scss']
})
export class TableComponentComponent{
  @Input() row: any;
  @Input() navigation: any;
  @Input() id : any;
  editItem() {
    console.log('navigation');
    this.router.navigate([this.navigation+'/'+this.id]);
    // Your edit logic here
  }

  deleteItem() {

  }

  constructor(
              private router: Router,) {
  }

}
