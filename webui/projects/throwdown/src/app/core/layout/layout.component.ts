import {ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {BreakpointObserver, Breakpoints, BreakpointState} from '@angular/cdk/layout';

import {NGXLogger} from 'ngx-logger';
import {Subject} from 'rxjs/subject';
import {Observable} from 'rxjs/observable';
import {Subscription} from 'rxjs/subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'tdn-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  private isHandset: Observable<BreakpointState>;
  private _isXSmall: Observable<BreakpointState>;
  private _onDestroyed: Subject<any>;
  private _subscribed: Subscription;
  public navbarMargin: { height: number };

  constructor(private breakpointObserver: BreakpointObserver, private logger: NGXLogger) {
    this.logger.info('Layout constructor');
    this.isHandset = this.breakpointObserver.observe(Breakpoints.Handset);
    this._isXSmall = this.breakpointObserver.observe(Breakpoints.XSmall);
    this._onDestroyed = new Subject<any>();

    // this._validateNavMargin();
    this.navbarMargin = { height: 100 };
  }

  @ViewChild("sidenavToolbar", {read: ElementRef}) private _sidenavToolbar: ElementRef<any>;
  @ViewChild("contentToolbar", {read: ElementRef}) private _contentToolbar: ElementRef<any>;

  public clickMe(): void {
    this.logger.info('Click-ity clack: ', this);
  }

  public ngOnInit(): void {
    this._subscribed = this._isXSmall
      .do((value: any) => { this.logger.info('Pretake', value);})
      .takeUntil(this._onDestroyed)
    // ).pipe(
      .startWith(null)
      .debounceTime(10)
    // ).pipe(
      .do((value: any) => { this.logger.info('Poststart', value);})
    .subscribe((value: any) => {
      this.logger.info('Trigger: ', value);
      this._validateNavMargin();
    }, (error: any) => {
      this.logger.error(error);
    }, () => {
      this.logger.error('Completed');
    })
  }

  public ngOnDestroy(): void {
    this._onDestroyed.next(null);
    this._onDestroyed.complete();
  }

  private _validateNavMargin() {
    const currentHeight = this._toolbarHeight + 8;

    if (!this.navbarMargin || this.navbarMargin.height !== currentHeight) {
      this.navbarMargin = {
        height: currentHeight
      };
    }
  }

  get _toolbarHeight() {
    return this._contentBarHeight || this._sidenavBarHeight || 0;
  }

  get _sidenavBarHeight() {
    return this._sidenavToolbar.nativeElement ? (this._sidenavToolbar.nativeElement.offsetHeight || 0) : 0;
  }

  get _contentBarHeight() {
    return this._contentToolbar.nativeElement ? (this._contentToolbar.nativeElement.offsetHeight || 0) : 0;
  }
}
