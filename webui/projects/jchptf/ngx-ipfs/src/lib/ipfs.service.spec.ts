import { TestBed, inject } from '@angular/core/testing';

import { NgxIpfsService } from './ngx-ipfs.service';

describe('NgxIpfsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxIpfsService]
    });
  });

  it('should be created', inject([NgxIpfsService], (service: NgxIpfsService) => {
    expect(service).toBeTruthy();
  }));
});
