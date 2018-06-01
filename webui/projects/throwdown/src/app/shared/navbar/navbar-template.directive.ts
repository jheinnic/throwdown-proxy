import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {CdkPortal} from '@angular/cdk/portal';

import {NGXLogger} from 'ngx-logger';

@Directive({
  selector: '[tdn-navbar-template], [tdnNavbarTemplate]'
})
export class NavbarTemplateDirective extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef, private logger: NGXLogger) {
    super(templateRef, viewContainerRef);
    this.logger.info('NavbarTemplateDirective constructor');
  }

  @Input() private default: boolean = false;

  public get isDefault(): boolean {
    this.logger.info('NavbarTemplateDirective isDefault check');
    return this.default;
  }
}
/*
implements OnInit, OnDestroy {
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
 */
