import {LayoutActions} from '../actions';
import {LayoutModels} from '../models';
import {NavbarTemplateDirective} from '../../../shared/navbar/navbar-template.directive';

export namespace LayoutSubFeature {
  export type State = LayoutModels.State;

  export const initialState: State = {
    activeNavbarTemplate: undefined
  };

  export function reducer(state: State = initialState, action: LayoutActions.Actions): State {
    switch (action.type) {
      case LayoutActions.ActionTypes.UpdateNavbarTemplates:
        return {
          ...state,
          activeNavbarTemplate: action.payload
        };

      default:
        return state;
    }
  }

  export function getLayoutActiveNavbarTemplate(state: State): NavbarTemplateDirective | undefined {
    return state.activeNavbarTemplate;
  }
}
