import {Directive, OnDestroy, OnInit, TemplateRef, ViewRef} from '@angular/core';
import {NavbarTemplateService} from './navbar-template.service';

@Directive({
  selector: '[tdnNavbarTemplate]'
})
export class NavbarTemplateDirective implements OnInit, OnDestroy {
  private embeddedView: ViewRef;

  constructor( private navbarTemplateService: NavbarTemplateService,
               private tpl: TemplateRef<any> ) {
  }

  ngOnInit() {
    this.embeddedView = this.navbarTemplateService.embedTemplate(this.tpl);
  }

  ngOnDestroy() {
    this.navbarTemplateService.removeView(this.embeddedView);
  }
}
