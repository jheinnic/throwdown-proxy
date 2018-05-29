import {AfterViewInit, Component, Input, QueryList} from '@angular/core';

import {NavbarTemplateDirective} from './navbar-template.directive';

@Component({
  selector: 'tdn-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent {
  // @ViewChild('defaultTemplate', {read: TemplateRef})
  // private defaultTemplate: TemplateRef<any>;

  // @ViewChild('defaultPortal')
  // private defaultPortal: CdkPortal;

  constructor() {
  }

  @Input() private contentTemplates: QueryList<NavbarTemplateDirective>

  // ngOnInit(): void {
  //   this.navbarTemplateService.embedTemplate(this.defaultTemplate);
  // }

  public get content(): QueryList<NavbarTemplateDirective> {
    return this.contentTemplates;
  }

  public clickMe(): void {
    console.log('Click-ity clack: ', this);
  }
}
