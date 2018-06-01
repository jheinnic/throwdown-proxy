import {Component, ViewChildren, QueryList, ViewChild, TemplateRef} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {Observable} from 'rxjs/observable';
import {NGXLogger} from 'ngx-logger';

import {NavbarTemplateDirective} from '../../shared/navbar/navbar-template.directive';

@Component({
  selector: 'tdn-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  private isHandset: Observable<BreakpointState>;

  /** Content for nav header marked by `<ng-template tdn-navbar-template>`. */
  // @ViewChildren(NavbarTemplateDirective) private navbarTemplates: QueryList<NavbarTemplateDirective>;
  @ViewChild(NavbarTemplateDirective) private navbarTemplate: NavbarTemplateDirective;

  constructor(private breakpointObserver: BreakpointObserver, private logger: NGXLogger) {
    this.isHandset = this.breakpointObserver.observe(Breakpoints.Handset);
    this.logger.info('Layout constructor');
  }

  public clickMe(): void {
    this.logger.info('Click-ity clack: ', this);
  }

  public ngOnInit() {
    this.logger.info("Layout", this.navbarTemplate);
  }

  public ngAfterViewInit(): void {
    this.logger.info("Layout ngAfterViewInit", this.navbarTemplate);

    // this.navbarTemplates.changes.subscribe(
    //   (contentList: QueryList<NavbarTemplateDirective>) => {
    //     this.logger.info("Layout changes", this.navbarTemplates, contentList);
    //   }
    // );
  }
}
