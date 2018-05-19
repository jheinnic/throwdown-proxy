import {TemplateRef, ViewContainerRef, ViewRef} from '@angular/core';

export class NavbarTemplateService {
  // View Container Reference
  private vcr: ViewContainerRef;

  // Embedded Template
  private etpl?: TemplateRef<any>;
  private context?: any;
  private index?: number;

  // Embedded View Reference
  private evr: ViewRef;

  constructor() {
    this.vcr = undefined;
    this.evr = undefined;
    this.etpl = undefined;
    this.context = undefined;
    this.index = undefined;
  }

  public hasContainer(): boolean {
    return !! this.vcr;
  }

  public hasTemplate(): boolean {
    return !! this.etpl;
  }

  public manageContainer(vcr: ViewContainerRef): void {
    if (!vcr) {
      throw new Error('Cannot set a null or undefined ViewContainerRef');
    } else if (this.hasContainer() && (this.vcr !== vcr)) {
      throw new Error('Cannot change the managed view container once it has been assigned');
    }

    this.vcr = vcr;

    if (this.hasTemplate()) {
      this.doTemplateExpansion();
    }
  }

  public embedTemplate<C extends any = any>(tpl: TemplateRef<C>, context?: C, index?: number): ViewRef {
    if (! tpl) {
      throw new Error('Cannot paint a null or undefined template');
    }

    if (!! this.evr) {
      this.removeView(this.evr);
    }

    this.etpl = tpl;
    this.context = context;
    this.index = index;

    if (this.hasContainer()) {
      this.doTemplateExpansion();
    }

    return this.evr;
  }

  public removeView(evr: ViewRef): void {
    if (this.evr === evr) {
      this.evr.destroy();
      this.evr = undefined;

      this.etpl = undefined;
      this.context = undefined;
      this.index = undefined;
    }
  }

  private doTemplateExpansion(): void {
    try {
      this.evr = this.vcr.createEmbeddedView(this.etpl, this.context, this.index);
    } catch (err) {
      console.error(err);
      this.vcr.clear();

      this.evr = undefined;
      this.etpl = undefined;
      this.context = undefined;
      this.index = undefined;
    }
  }
}
