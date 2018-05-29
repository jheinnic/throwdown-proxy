import {ComponentFactoryResolver, Directive, OnDestroy, OnInit, QueryList, ViewContainerRef} from '@angular/core';
import {CdkPortalOutlet} from '@angular/cdk/portal';

import {Subscription} from 'rxjs/subscription';

import {NavbarComponent} from './navbar.component';
import {NavbarTemplateDirective} from './navbar-template.directive';

@Directive({
  selector: '[tdn-navbar-container], [tdnNavbarContainer]'
})
export class NavbarContainerDirective extends CdkPortalOutlet implements OnInit, OnDestroy {
  private currentTemplate: NavbarTemplateDirective;
  private templatesSubscription: Subscription;

  constructor(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef, private navbar: NavbarComponent) {
    super(componentFactoryResolver, viewContainerRef);
  }

  ngOnInit() {
    super.ngOnInit();

    this.templatesSubscription = this.navbar.content.changes.subscribe(
      (contentList: QueryList<NavbarTemplateDirective>) => {
        const nextTemplate = contentList.first;
        if ((!!nextTemplate) && (this.currentTemplate !== nextTemplate)) {
          if (this.hasAttached()) {
            this.detach();
          }

          this.currentTemplate = nextTemplate;
          this.attachTemplatePortal(nextTemplate);
        }
      }
    );
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.templatesSubscription) {
      this.templatesSubscription.unsubscribe();
      this.templatesSubscription = undefined;

      if (this.currentTemplate) {
        this.detach();
        this.currentTemplate = undefined;
      }
    }
  }
}
