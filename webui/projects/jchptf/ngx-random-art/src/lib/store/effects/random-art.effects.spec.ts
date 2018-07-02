import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { RandomArtEffects } from './web3.effects';

describe('Web3Effects', () => {
  const actions$: Observable<any>;
  let effects: RandomArtEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RandomArtEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(RandomArtEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
