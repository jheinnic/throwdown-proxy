import {Directive, Host, TemplateRef, ViewContainerRef} from '@angular/core';
import {NavbarTemplateService} from './navbar-template.service';
import {NavbarComponent} from './navbar.component';

@Directive({
  selector: '[tdnNavbarContainer]'
})
export class NavbarContainerDirective
{
  constructor(private navbarTemplateService: NavbarTemplateService,
              private vcr: ViewContainerRef
  ) {
    navbarTemplateService.manageContainer(vcr);
  }
}
