import { TestBed } from '@angular/core/testing';

import { UCAService } from './uca.service';

describe('UCAService', () => {
  let service: UCAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UCAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
