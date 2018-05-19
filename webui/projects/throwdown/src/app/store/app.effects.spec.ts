import { TestBed, inject } from '@angular/core/testing';
import {Actions} from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/observable';

import { AppEffects } from './store.effects';

describe('StoreEffects', () => {
  let actions$: Observable<any>;
  let effects: AppEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppEffects,
        provideMockActions(() => actions$)
      ]
    });

    // TODO: What is actions$ meant to be bound to?  I filled in a best guess below, but it is probably
    //       meant to be a feature-defined Actions map...  Update: It is actually probably spot on.
    actions$ = TestBed.get(Actions);
    effects = TestBed.get(AppEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
