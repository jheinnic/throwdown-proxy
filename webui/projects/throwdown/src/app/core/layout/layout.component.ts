import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';
import {Component} from '@angular/core';
import {Observable} from 'rxjs/Observable';

import {NavbarTemplateService} from '../../shared/navbar/navbar-template.service';

@Component({
  selector: 'tdn-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [NavbarTemplateService]
})
export class LayoutComponent {
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(private breakpointObserver: BreakpointObserver) {
  }

  public clickMe(): void {
    console.log('Click-ity clack: ', this);
  }
}
