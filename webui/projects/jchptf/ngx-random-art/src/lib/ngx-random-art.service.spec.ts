import { TestBed, inject } from '@angular/core/testing';

import { NgxRandomArtService } from './ngx-random-art.service';

describe('NgxRandomArtService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxRandomArtService]
    });
  });

  it('should be created', inject([NgxRandomArtService], (service: NgxRandomArtService) => {
    expect(service).toBeTruthy();
  }));
});
