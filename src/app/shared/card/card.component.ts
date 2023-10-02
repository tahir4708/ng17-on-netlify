import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {cardToggle, cardClose} from './card-animation';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  animations: [cardToggle, cardClose],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  @Input() headerContent: string | undefined;
  @Input() title: string | undefined;
  @Input() blockClass: string | undefined;
  @Input() cardClass: string | undefined;
  @Input() classHeader = false;
  @Input() targetForComponent: any;
  cardToggle = 'expanded';
  cardClose = 'open';
  fullCard: string | undefined;
  fullCardIcon: string | undefined;
  loadCard = false;
  isCardToggled = false;
  cardLoad: string | undefined;
  constructor(private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
  }

  toggleCard(event: any) {
    this.cardToggle = this.cardToggle === 'collapsed' ? 'expanded' : 'collapsed';
  }

  closeCard(event: any) {
    this.cardClose = this.cardClose === 'closed' ? 'open' : 'closed';
  }

  fullScreen(event: any) {
    this.fullCard = this.fullCard === 'full-card' ? '' : 'full-card';
    this.fullCardIcon = this.fullCardIcon === 'icofont-resize' ? '' : 'icofont-resize';
  }

  appCardRefresh() {
    this.loadCard = true;
    this.cardLoad = 'card-load';
    setTimeout( () => {
      this.cardLoad = '';
      this.loadCard = false;
    }, 3000);
  }

  addTask() {
    this.router.navigate([this.targetForComponent]);
  }
}
