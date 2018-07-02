import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { Web3Effects } from './web3.effects';

describe('Web3Effects', () => {
  const actions$: Observable<any>;
  let effects: Web3Effects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        Web3Effects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(Web3Effects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
