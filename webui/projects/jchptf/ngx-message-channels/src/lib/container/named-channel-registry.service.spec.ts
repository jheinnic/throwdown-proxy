import { TestBed, inject } from '@angular/core/testing';

import { CspFactoryService } from './csp-factory.service';

describe('CspFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CspFactoryService]
    });
  });

  it('should be created', inject([CspFactoryService], (service: CspFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
