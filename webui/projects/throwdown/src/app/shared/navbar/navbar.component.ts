import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NavbarTemplateService} from './navbar-template.service';
import {CdkPortal} from '@angular/cdk/portal';

@Component({
  selector: 'tdn-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent implements OnInit {
  @ViewChild('defaultTemplate', {read: TemplateRef})
  private defaultTemplate: TemplateRef<any>;

  @ViewChild('defaultPortal')
  private defaultPortal: CdkPortal;

  constructor(private navbarTemplateService: NavbarTemplateService) {
  }

  ngOnInit(): void {
    this.navbarTemplateService.embedTemplate(this.defaultTemplate);
  }

  public clickMe(): void {
    console.log('Click-ity clack: ', this);
  }
}
