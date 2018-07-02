import { TestBed, inject } from '@angular/core/testing';
import {Store} from '@ngrx/store';

import { Web3Service } from './web3.service';
import {NGXLogger} from 'ngx-logger';

describe('Web3Service', () => {
  beforeEach(() => {
    const storeSpy: jasmine.SpyObj<Store<any>> = jasmine.createSpyObj('Store', ['dispatch', 'select']);
    const loggerSpy: jasmine.SpyObj<NGXLogger> = jasmine.createSpyObj('NGXLogger', ['info', 'error']);

    TestBed.configureTestingModule({
      providers: [Web3Service, {
        provider: Store,
        useValue: storeSpy
      }, {
        provider: NGXLogger,
        useValue: loggerSpy
      }]
    });
  });

  it('should be created', inject([Web3Service], (service: Web3Service) => {
    expect(service).toBeTruthy();
  }));

  it('')
});
