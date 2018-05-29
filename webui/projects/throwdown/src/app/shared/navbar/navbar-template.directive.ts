import {Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {CdkPortal} from '@angular/cdk/portal';

@Directive({
  selector: '[tdn-navbar-template], [tdnNavbarTemplate]'
})
export class NavbarTemplateDirective extends CdkPortal {
  constructor(templateRef: TemplateRef<any>, viewContainerRef: ViewContainerRef) {
    super(templateRef, viewContainerRef);
  }

  @Input() private default: boolean = false;

  public get isDefault(): boolean {
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
