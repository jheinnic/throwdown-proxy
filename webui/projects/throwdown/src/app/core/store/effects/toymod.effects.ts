import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ToymodActions } from '../actions/toymod.actions';

@Injectable()
export class ToymodEffects {

  @Effect()
  effect$ = this.actions$.ofType(ToymodActions.ActionTypes.LoadToymods);

  constructor(private actions$: Actions) {}
}
