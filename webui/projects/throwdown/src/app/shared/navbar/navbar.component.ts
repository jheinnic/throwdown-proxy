import {Component, Input} from '@angular/core';

import {Store} from '@ngrx/store';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs/observable';

import {NavbarTemplateDirective} from './navbar-template.directive';
import {RootStore} from '../../store';
import {CoreFeature} from '../../core/store/reducers';

@Component({
  selector: 'tdn-navbar',
  template: '<ng-template [cdkPortalOutlet]="navbarTemplate | async"></ng-template>',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent {
  // @ViewChild('defaultTemplate', {read: TemplateRef})
  // private defaultTemplate: TemplateRef<any>;

  // @ViewChild('defaultPortal')
  // private defaultPortal: CdkPortal;
  public readonly navbarTemplate: Observable<NavbarTemplateDirective>;

  constructor(private store: Store<RootStore.State>,  private logger: NGXLogger) {
    this.logger.info('Navbar Component constructor');
    this.navbarTemplate = this.store.select(CoreFeature.selectActiveNavbarTemplate);
  }

  // public get content(): Observable<NavbarTemplateDirective> {
  // this.logger.info('Get NavbarComponent content template ', this.routeTemplate, this.defaultTemplate)
  // return (!! this.routeTemplate) ? this.routeTemplate : this.defaultTemplate;
  // return this.contentTemplates;
  // }
}
