import {ComponentFactoryResolver, Directive, OnInit, OnDestroy, AfterViewInit, QueryList, ViewContainerRef} from '@angular/core';
import {CdkPortalOutlet} from '@angular/cdk/portal';

import {Subscription} from 'rxjs/subscription';
import {NGXLogger} from 'ngx-logger';

import {NavbarComponent} from './navbar.component';
import {NavbarTemplateDirective} from './navbar-template.directive';

@Directive({
  selector: '[tdn-navbar-container], [tdnNavbarContainer]'
})
export class NavbarContainerDirective extends CdkPortalOutlet implements OnInit, OnDestroy {
  private currentTemplate: NavbarTemplateDirective;
  private templatesSubscription: Subscription;

  constructor(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef,
              private logger: NGXLogger, private store: NavbarComponent) {
    super(componentFactoryResolver, viewContainerRef);

    this.logger.info('Navbar Container Directive constructor');
  }

  ngOnInit() {
    super.ngOnInit()

    this.logger.info("Navbar container onInit");

    /*
    this.templatesSubscription = this.navbar.contentTemplate.subscribe(
      (nextTemplate: NavbarTemplateDirective) => {
        this.logger.info("Navbar container changes", this.navbar.contentTemplate, nextTemplate);

        // const nextTemplate = contentList.reduce(function (best, next) {
        //   return ((!best) || (best.isDefault())) ? next : best;
        // }, undefined);

        // if ((!!nextTemplate) && (this.currentTemplate !== nextTemplate)) {
          if (this.hasAttached()) {
            this.detach();
          }

          // this.currentTemplate = nextTemplate;
          if (!! nextTemplate) {
            this.attachTemplatePortal(nextTemplate);
          }
        // }
      }
    );
      */
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.logger.info("Navbar container destroy"); // , this.navbar.contentTemplate);

    if (this.templatesSubscription) {
      this.templatesSubscription.unsubscribe();
      this.templatesSubscription = undefined;

      if (this.hasAttached()) {
        this.detach();
        // this.currentTemplate = undefined;
      }
    }
  }
}
