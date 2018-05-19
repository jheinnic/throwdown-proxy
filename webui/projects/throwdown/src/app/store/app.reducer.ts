import { Action } from '@ngrx/store';

import {appInitialState, AppState} from '../shared/store/app.state';

export function appReducer(state?: AppState, action?: Action) {
  if (state === void 0) { state = appInitialState; }
  switch (action.type) {
    default:
    {
      return state;
    }
  }
}

