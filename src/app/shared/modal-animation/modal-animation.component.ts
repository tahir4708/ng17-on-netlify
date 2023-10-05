import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-modal-animation',
  templateUrl: './modal-animation.component.html',
  styleUrls: ['./modal-animation.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ModalAnimationComponent implements OnInit {

  @Input() modalClass: string | undefined;
  @Input() contentClass: string | undefined;
  @Input() modalID: string | undefined;
  @Input() backDrop = false;

  constructor() { }

  ngOnInit() {

  }

  close(event: string) {
    // @ts-ignore
    document.querySelector('#' + event).classList.remove('md-show');
  }
}
