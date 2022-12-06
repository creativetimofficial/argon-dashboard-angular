import { TestBed } from '@angular/core/testing';

import { CamionsService } from './camions.service';

describe('CamionsService', () => {
  let service: CamionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CamionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
