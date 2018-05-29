import {Component, ContentChildren, QueryList} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs/observable';

import {NavbarTemplateService} from '../../shared/navbar/navbar-template.service';
import {NavbarTemplateDirective} from '../../shared/navbar/navbar-template.directive';

@Component({
  selector: 'tdn-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [NavbarTemplateService]
})
export class LayoutComponent {
  private isHandset: Observable<BreakpointState>;

  /** Content for nav header marked by `<ng-template tdn-navbar-template>`. */
  @ContentChildren(NavbarTemplateDirective, {descendants: true}) private navbarTemplates: QueryList<NavbarTemplateDirective>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset = this.breakpointObserver.observe(Breakpoints.Handset);
  }

  public clickMe(): void {
    console.log('Click-ity clack: ', this);
  }
}
