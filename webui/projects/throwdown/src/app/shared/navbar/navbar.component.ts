import {AfterViewInit, Component, Input, QueryList} from '@angular/core';

import {NGXLogger} from 'ngx-logger';

import {NavbarTemplateDirective} from './navbar-template.directive';

@Component({
  selector: 'tdn-navbar',
  // templateUrl: './navbar.component.html',
  template: '<ng-template tdnNavbarContainer></ng-template>',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent implements AfterViewInit {
  // @ViewChild('defaultTemplate', {read: TemplateRef})
  // private defaultTemplate: TemplateRef<any>;

  // @ViewChild('defaultPortal')
  // private defaultPortal: CdkPortal;

  constructor(private logger: NGXLogger) {
    this.logger.info('Navbar Component constructor');
  }

  @Input() private routeTemplate: NavbarTemplateDirective;
  @ContentChild(NavbarTemplateDirective) private defaultTemplate: NavbarTemplateDirective;

  public get content(): NavbarTemplateDirective {
    this.logger.info('Get NavbarComponent content template ', this.routeTemplate, this.defaultTemplate)
    return (!! this.routeTemplate) ? this.routeTemplate : this.defaultTemplate;
  }

  public ngAfterViewInit(): void {
    this.logger.info('Navbar Component After View Init ', this.routeTemplate, this.defaultTemplate);
  }

  public clickMe(): void {
    this.logger.info('Click-ity clack: ', this);
  }
}
