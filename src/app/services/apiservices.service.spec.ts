import { TestBed } from '@angular/core/testing';

import { ApiservicesService } from './apiservices.service';

describe('ApiservicesService', () => {
  let service: ApiservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
