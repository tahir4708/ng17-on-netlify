import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: [
    './notifications.component.scss',],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit {
  position = 'bottom-right';
  title: string | undefined;
  msg: string | undefined;
  showClose = true;
  theme = 'bootstrap';
  type = 'default';
  closeOther = false;
  constructor() {}

  ngOnInit() {
  }

  addToast(options: { closeOther: any; position: string; title: any; msg: any; showClose: any; timeout: any; theme: any; type: any; }) {
    if (options.closeOther) {
    }
    this.position = options.position ? options.position : this.position;


  }
}
