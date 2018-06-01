import { Action } from '@ngrx/store';
import {NavbarTemplateDirective} from '../../../shared/navbar/navbar-template.directive';

export namespace LayoutActions {
  export enum ActionTypes {
    UpdateNavbarTemplates = '[Layout] Update Navbar Templates'
  }

  export class UpdateNavbarTemplates implements Action {
    readonly type = ActionTypes.UpdateNavbarTemplates;
    readonly payload: NavbarTemplateDirective;

    constructor(payload: Array<NavbarTemplateDirective>) {
      this.payload = payload.reduce((agg: NavbarTemplateDirective | undefined, current: NavbarTemplateDirective) => {
        if (agg === undefined) {
          return current;
        }

        return agg.compareTo(current);
      })
    }
  }

  export type Actions = UpdateNavbarTemplates;
}
