import { TestBed } from '@angular/core/testing';

import { ICOSAFService } from './ICOSAFService.service';

describe('UCCServiceService', () => {
  let service: ICOSAFService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ICOSAFService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
