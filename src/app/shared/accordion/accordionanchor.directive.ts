import { Directive, HostListener, Inject } from '@angular/core';

import { AccordionLinkDirective } from './accordionlink.directive';

@Directive({
  selector: '[appAccordionToggle]'
})
export class AccordionAnchorDirective {

  protected navlink: AccordionLinkDirective;

  constructor( @Inject(AccordionLinkDirective) navlink: AccordionLinkDirective) {
    this.navlink = navlink;
  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(e: any) {
    this.navlink.toggle();
  }
}
